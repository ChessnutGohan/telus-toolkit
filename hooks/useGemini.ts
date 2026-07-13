"use client";

import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

type GeminiFeature= "example" | "batch" | "script" | "pdf" | "validate";

async function hashKey(text: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

export function useGemini() {
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);

    const ask = useCallback(async (
        prompt: string,
        feature: GeminiFeature,
        skipCache: boolean = false
    ): Promise<string | null> => {
        setLoading(true);
        setError(null);

        try {
            const key = await hashKey(`${feature}-${prompt}`);
            // Check cache first to avoid rate limits
            if (!skipCache) {
                const { data } = await supabase
                    .from("gemini")
                    .select("response")
                    .eq("cache_key", key)
                    .single();

                if (data?.response) {
                    setLoading(false);
                    return data.response;
                }
            }

            const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + process.env.NEXT_PUBLIC_GEMINI_API_KEY, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {temperature: 0.7, maxOutputTokens: 4000 },
                }),
            });

            const data = await res.json();
            const response = data?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!response) throw new Error("No response from Gemini");

            //send to cache the response

            await supabase.from("gemini_cache").upsert({
                cache_key: key,
                response, 
                feature,
            });

            setLoading(false);
            return response;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Gemini Error");
            setLoading(false);
            return null;
        }
    }, []);

    return {
        ask, loading, error
    };
}
