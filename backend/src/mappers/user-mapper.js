export function mappingUserResponse(user) {
    return {
        id: user.id,
        authId: user.auth_id,
        email: user.email,
        name: user?.name ?? '',
        lastName: user.last_name,
        role: user.role,
        createAt: user.create_at
    }
}