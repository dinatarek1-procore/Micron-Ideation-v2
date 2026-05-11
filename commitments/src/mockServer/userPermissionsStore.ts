export interface UserPermission {
  id: string;
  name: string;
  contact_id: string;
  company_directory_admin: boolean;
  user_access_level: { id: number; name: string };
  vendor: { id: number; name: string } | null;
}

const SEED_USERS: UserPermission[] = [
  {
    id: '2',
    name: 'Example, Alex',
    contact_id: '34820',
    company_directory_admin: false,
    user_access_level: { id: 3, name: 'Standard' },
    vendor: { id: 37, name: 'Acme Builders' },
  },
  {
    id: '4',
    name: 'Example, Jordan',
    contact_id: '34795',
    company_directory_admin: true,
    user_access_level: { id: 4, name: 'Admin' },
    vendor: null,
  },
];

let users: UserPermission[] = [];

export function resetUserPermissionsStore(): void {
  users = SEED_USERS.map((u) => ({ ...u }));
}

resetUserPermissionsStore();

export function listUserPermissions(): UserPermission[] {
  return users;
}

export function updateUserPermission(
  id: string,
  accessLevelId: number
): UserPermission | undefined {
  const user = users.find((u) => u.id === id);
  if (!user) return undefined;
  const levelNames: Record<number, string> = {
    1: 'None',
    2: 'Read Only',
    3: 'Standard',
    4: 'Admin',
  };
  user.user_access_level = {
    id: accessLevelId,
    name: levelNames[accessLevelId] ?? 'Unknown',
  };
  return user;
}
