import { PrismaClient } from "@prisma/client";
import { createHash } from "crypto";

const prisma = new PrismaClient();

// Helper function to create password hash
const createPasswordHash = (password: string): string => {
  return createHash("sha256").update(password).digest("hex");
};

// Generate random data functions
const generateUsername = (index: number) => `user${index}`;
const generateEmail = (username: string) => `${username}@example.com`;
const generateContent = (type: "post" | "comment") => {
  const postPhrases = [
    "Just another day in the tech world",
    "Excited about new technologies",
    "Working on an interesting project",
    "Sharing some thoughts on software development",
    "Building something awesome",
  ];

  const commentPhrases = [
    "Great post!",
    "Interesting perspective",
    "I totally agree",
    "Could you elaborate more?",
    "This is exactly what I was thinking",
  ];

  const phrases = type === "post" ? postPhrases : commentPhrases;
  return phrases[Math.floor(Math.random() * phrases.length)];
};

async function seedDatabase() {
  console.log("Starting database seeding...");

  // Create users
  const users = [];
  for (let i = 1; i <= 10; i++) {
    const username = generateUsername(i);
    const user = await prisma.user.create({
      data: {
        username,
        name: `User ${i}`,
        email: generateEmail(username),
        password: createPasswordHash(`password${i}`),
      },
    });
    users.push(user);
  }
  console.log(`Created ${users.length} users`);

  // Create posts
  const posts = [];
  for (let i = 0; i < 20; i++) {
    const author = users[Math.floor(Math.random() * users.length)];
    const post = await prisma.post.create({
      data: {
        content: generateContent("post"),
        authorId: author.id,
      },
    });
    posts.push(post);
  }
  console.log(`Created ${posts.length} posts`);

  // Create comments
  const comments = [];
  for (let i = 0; i < 50; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const post = posts[Math.floor(Math.random() * posts.length)];
    const comment = await prisma.comment.create({
      data: {
        content: generateContent("comment"),
        postId: post.id,
        userId: user.id,
      },
    });
    comments.push(comment);
  }
  console.log(`Created ${comments.length} comments`);

  // Create likes
  const likes = [];
  const likeMap = new Set();
  for (let i = 0; i < 30; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const post = posts[Math.floor(Math.random() * posts.length)];

    // Ensure unique likes
    const likeKey = `${user.id}-${post.id}`;
    if (!likeMap.has(likeKey)) {
      const like = await prisma.like.create({
        data: {
          postId: post.id,
          userId: user.id,
        },
      });
      likes.push(like);
      likeMap.add(likeKey);
    }
  }
  console.log(`Created ${likes.length} likes`);

  console.log("Database seeding completed successfully!");
}

// Run the seeding script
seedDatabase()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
