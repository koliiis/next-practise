export const PAGES = {
  SIGNIN: '/auth/signin',
  SIGNUP: '/auth/signup',
  PROFILE: (username: string) => `/user/${username}`,
  HOME: '/',
  POSTS: '/posts',
  POST: (postId: number) => `/posts/${postId}`,
}