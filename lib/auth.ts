export type AppUser = {
    name: string, 
    password: string;
};

export function getUsers(): AppUser[] {
    const raw = process.env.NEXT_PUBLIC_USERS ?? "";
    return raw.split(",").map((entry) => {
        const [name, password] = entry.split(":");
        return { name, password };
    });
}

export function authenticate(password: string): string | null {
    const users = getUsers();
    const match = users.find((u) => u.password === password);
    return match ? match.name : null;
}
export function isAdmin(name: string): boolean {
  return name === "regrets";
}
