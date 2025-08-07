'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { PostType } from '@/shared/types/post';
import { useComments } from '@/stores/useComments';
import { PAGES } from '@/config/pages.config';
import { formatDistanceToNow } from 'date-fns';
import { DeletePost } from '@/app/server-actions/delete-post';
import { toggleLike } from '@/app/server-actions/toggle-like';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import Link from 'next/link';
import { CircleArrowLeft, Heart, HeartCrack, MessageCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { CommentSkeleton } from '@/components/comment/CommentSkeleton';
import { FullPostSkeleton } from '@/components/post/FullPostSceleton';

export default function PostDetailPage() {
  const { postId } = useParams();
  const router = useRouter();

  const [post, setPost] = useState<PostType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [pending, setPending] = useState(false);
  const { comments, loadComments, addComment } = useComments();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loadingComments, setLoadingComments] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/posts/${postId}`);
        if (!res.ok) {
          router.push('/404');
          return;
        }
        const data = await res.json();
        setPost(data);
      } catch {
        router.push('/404');
      } finally {
        setIsLoading(false);
      }
    }

    async function fetchComments() {
      setLoadingComments(true);
      if (postId) await loadComments(+postId);
      setLoadingComments(false);
    }

    fetchPost();
    fetchComments();
  }, [postId, loadComments, router]);

  useEffect(() => {
    if (post) {
      setLiked(post.likedByCurrentUser);
      setLikesCount(post.likesCount ?? 0);
    }
  }, [post]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function refreshPost() {
    try {
      const res = await fetch(`/api/posts/${postId}`);
      const data = await res.json();
      setPost(data);
    } catch (err) {
      console.error("Failed to load post", err);
    }
  }

  async function handleDelete() {
    try {
      if (post?.id) await DeletePost(post.id);
      if (window.history.length > 1) {
        router.back();
      } else {
        router.push(PAGES.HOME);
      }
    } catch {
      alert("Failed to delete post");
    }
  }

  async function handleBack() {
    try {
      if (window.history.length > 1) {
        router.back();
      } else {
        router.push(PAGES.HOME);
      }
    } catch {
      alert("Failed to go back");
    }
  }

  async function handleLike() {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount((prev) => prev + (newLiked ? 1 : -1));

    try {
      if (post?.id) await toggleLike(post.id);
      refreshPost();
    } catch {
      setLiked(!newLiked);
      setLikesCount((prev) => prev + (newLiked ? -1 : 1));
      alert("Failed to like post");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) return;

    const userId = session?.user?.id;
    if (!userId) return;

    try {
      setPending(true);
      if (postId) await addComment(+postId, newComment, +userId);
      setNewComment('');
      if (postId) {
        await loadComments(+postId);
        await refreshPost();
      }
    } catch {
      alert('Failed to add comment');
    } finally {
      setPending(false);
    }
  }

  if (isLoading) {
    return (
      <div className="bg-neutral-900 p-8 rounded-2xl text-white">
        <FullPostSkeleton />
      </div>
    );
  }

  if (!post) return null;


  return (
    <div className="bg-neutral-900 p-8 rounded-2xl text-white">
      <div className='flex justify-between mb-8'>
        <button onClick={handleBack} className='cursor-pointer text-neutral-600 hover:text-white transition'><CircleArrowLeft size={30} /></button>
        <h1 className="text-sm mt-1 sm:text-xl font-bold text-neutral-300">{post.title}</h1>

        {+session?.user?.id === post.userId ? (
          <div className="relative transition-opacity duration-500" ref={menuRef}>
            <button
              onClick={(e) => {
                e.preventDefault();
                setMenuOpen(!menuOpen);
              }}
              className="text-gray-400 hover:text-gray-200 cursor-pointer"
              aria-label="Post options"
            >
              <HiOutlineDotsHorizontal size={25} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-32 rounded shadow-md z-10 bg-neutral-900 border border-neutral-700">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleDelete();
                  }}
                  className="block w-full text-left px-4 py-2 text-neutral-800 hover:text-red-800 bg-neutral-300 hover:bg-white cursor-pointer rounded"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="relative invisible hidden sm:flex" ref={menuRef}>
            <button className="text-gray-400 hover:text-gray-200 cursor-pointer" aria-label="Post options">
              <HiOutlineDotsHorizontal size={25} />
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 ml-2">
        <div className='flex flex-col'>
          <div className="flex gap-4">
            <Link href={PAGES.PROFILE(post.User.username)} className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white">
              {post?.User.username[0]?.toUpperCase()}
            </Link>
            <div className="flex items-center gap-2">
              <Link href={PAGES.PROFILE(post.User.username)} className="font-semibold">{post.User.username}</Link>
              <span className="text-xs sm:text-sm text-neutral-500">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
          <div className="flex-1">

            <p className="mt-6 mb-6 text-2xl break-all whitespace-pre-line"
              style={{
                overflow: "hidden",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                textOverflow: "ellipsis",
              }}>
              {post.text}
            </p>
          </div>
        </div>

        <div className='flex items-center gap-4 mb-4 sm:mb-0 mr-4'>
          <button
            onClick={(e) => {
              handleLike();
              e.preventDefault();
            }}
            className="flex items-center gap-2 text-neutral-500 hover:text-white transition cursor-pointer"
          >
            {liked ? <Heart color="#a600ff" /> : <HeartCrack />}
            <p>{likesCount}</p>
          </button>

          <button className="flex items-center gap-2 text-neutral-500 hover:text-white transition cursor-pointer">
            <MessageCircle />
            <span>{comments.length}</span>
          </button>
        </div>
      </div>

      <section className="mt-4">
        <h2 className="text-xl font-semibold">Comments</h2>

        {session?.user && (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <textarea
              className="flex-grow w-full p-3 rounded bg-neutral-800 text-white border border-neutral-600 resize-none"
              rows={3}
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={pending}
            />
            <button
              type="submit"
              disabled={pending || !newComment.trim()}
              className={`px-4 py-2 rounded font-medium transition w-25 ${newComment.trim()
                ? "bg-purple-500 hover:bg-purple-600 text-white cursor-pointer"
                : "bg-gray-300 text-gray-400 cursor-not-allowed"
                }`}
            >
              {pending ? "Posting..." : "Post"}
            </button>
          </form>
        )}

        <div className="mt-8 space-y-4">
          {loadingComments ? (
            <>
              <CommentSkeleton />
              <CommentSkeleton />
              <CommentSkeleton />
            </>
          ) : comments.length !== 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="bg-neutral-800 p-4 rounded">
                <div className='flex items-center gap-2'>
                  <Link href={PAGES.PROFILE(comment.User.username)} className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white">
                    {comment.User.username[0]?.toUpperCase()}
                  </Link>
                  <p className="text-neutral-500">{comment.User.username}</p>
                </div>
                <p className="text-sm mt-4 text-neutral-300">{comment.text}</p>
              </div>
            ))
          ) : (
            <p className="text-neutral-500 text-sm">No comments yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
