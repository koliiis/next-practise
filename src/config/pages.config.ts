export const PAGES = {
  SIGNIN: '/auth/signin',
  SIGNUP: '/auth/signup',
  NOTE: (noteId: number) => `/posts/${noteId}`,
  PROFILE: (username: string) => `/user/${username}`,
  HOME: '/',
  NOTES: '/posts'
}