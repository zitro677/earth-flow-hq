// Shared workspace mapping.
// These two users see and edit the same business data (clients, projects,
// invoices, proposals, expenses, inventory, suppliers).
//
// The canonical owner stores all rows in the DB; the other member's id is
// remapped to the canonical owner before reading/writing so that both users
// share a single dataset. RLS on the server enforces the same rule.

const WORKSPACE_OWNER_ID = "d9150e1f-189c-43bc-9a3f-2deeb02a2e57"; // djsasvehiculos@gmail.com

const SHARED_USER_IDS: ReadonlySet<string> = new Set([
  WORKSPACE_OWNER_ID,
  "a90d6212-e903-40aa-ba29-8440e3bdbe6e", // yuyub2000@gmail.com
]);

/**
 * Returns the canonical user_id used to store/query shared workspace data.
 * For users not in the shared workspace, returns their own id unchanged.
 */
export const getWorkspaceUserId = (userId: string | null | undefined): string => {
  if (!userId) return "";
  return SHARED_USER_IDS.has(userId) ? WORKSPACE_OWNER_ID : userId;
};

export const isWorkspaceMember = (userId: string | null | undefined): boolean =>
  !!userId && SHARED_USER_IDS.has(userId);
