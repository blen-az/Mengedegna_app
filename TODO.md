# Role-Based Access Control Implementation

## Tasks

- [x] Update `createUserProfile` in `services/firebase.ts` to set default role "user" on user creation
- [x] Update `register` function in `context/AuthContext.tsx` to pass role field when creating user profile
- [x] Update Google sign-in flow in `context/AuthContext.tsx` to pass role field when creating user profile
- [x] Test user signup and verify role field is set in Firestore (User testing)
- [x] Run backfill script if needed for existing users without roles (User testing)
- [x] Verify Firestore security rules are working with role-based access (User testing)

## Notes

- Firestore security rules already implemented for role-based access (admin, operator, user)
- Backfill script available at `scripts/backfillUserRoles.js` to set default roles for existing users
- Role updates can be done via `updateUserProfile` or direct Firestore updateDoc
