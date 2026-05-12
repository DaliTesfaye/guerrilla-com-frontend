import api from "@/lib/api";

export type Profile = {
  _id?: string;
  name: string;
  email: string;
  role?: string;
  status?: string;
  createdAt?: string;
};

export type UpdateProfilePayload = {
  name?: string;
  email?: string;
};

export type ChangeProfilePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export type UpdateProfileResult = {
  profile: Profile | null;
  message?: string;
};

function extractProfile(candidate: unknown): Profile | null {
  if (!candidate || typeof candidate !== "object") {
    return null;
  }

  const maybeProfile = candidate as Partial<Profile>;
  if (typeof maybeProfile.name === "string" && typeof maybeProfile.email === "string") {
    return {
      _id: maybeProfile._id,
      name: maybeProfile.name,
      email: maybeProfile.email,
      role: maybeProfile.role,
      status: maybeProfile.status,
      createdAt: maybeProfile.createdAt,
    };
  }

  return null;
}

export async function getProfile(): Promise<Profile> {
  const res = await api.get("/profile");
  const directProfile = extractProfile(res.data);
  const nestedProfile =
    extractProfile((res.data as { profile?: unknown })?.profile) ||
    extractProfile((res.data as { user?: unknown })?.user) ||
    extractProfile((res.data as { data?: unknown })?.data);

  const profile = directProfile || nestedProfile;
  if (!profile) {
    throw new Error("Invalid profile response");
  }

  return profile;
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<UpdateProfileResult> {
  const res = await api.patch("/profile", payload);
  const directProfile = extractProfile(res.data);
  const nestedProfile =
    extractProfile((res.data as { profile?: unknown })?.profile) ||
    extractProfile((res.data as { user?: unknown })?.user) ||
    extractProfile((res.data as { data?: unknown })?.data);

  const message =
    typeof (res.data as { message?: unknown })?.message === "string"
      ? ((res.data as { message?: string }).message as string)
      : undefined;

  return {
    profile: directProfile || nestedProfile,
    message,
  };
}

export async function changePassword(payload: ChangeProfilePasswordPayload): Promise<void> {
  await api.patch("/profile/change-password", payload);
}
