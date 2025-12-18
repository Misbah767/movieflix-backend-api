/* ================= RBAC HELPER ================= */
export const checkAdminOrOwner = (user, resource) => {
  if (user.role !== "Admin" && !resource.createdBy.equals(user._id)) {
    throw new Error("Not authorized");
  }
};

export const checkAdmin = (user) => {
  if (user.role !== "Admin") throw new Error("Admin access required");
};

export const checkRoles = (user, allowedRoles = []) => {
  if (!allowedRoles.includes(user.role)) throw new Error("Access denied");
};
