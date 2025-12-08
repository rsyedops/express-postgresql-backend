import { hashPassword } from "#lib/crypto/hashPassword.js";
import { CreateArticleRequestSchema } from "#modules/articles/schemas.js";
import { createArticle } from "#modules/articles/services.js";
import { NewUser } from "#modules/auth/models.js";
import { randomBytes } from "crypto";

import { db } from "./index.js";
import { articlesFavorited, comments, users } from "./schema.js";

const usersSeed = {
  johndoe: {
    bio: "Full-stack developer passionate about clean code and innovative solutions. Love working with modern web technologies.",
    email: "johndoe@gmail.com",
    index: 0,
  },
  // eslint-disable-next-line perfectionist/sort-objects
  janesmith: {
    bio: "Frontend developer with a keen eye for UI/UX design. Specializing in React and modern CSS frameworks.",
    email: "janesmith@gmail.com",
    index: 1,
  },
  mikewilson: {
    bio: "Backend engineer focused on scalable architecture and DevOps. Enthusiast of cloud technologies and automation.",
    email: "mikewilson@gmail.com",
    index: 2,
  },
  sarahchen: {
    bio: "Data scientist and machine learning engineer. Passionate about turning data into actionable insights.",
    email: "sarahchen@gmail.com",
    index: 3,
  },
};

const articlesSeed: CreateArticleRequestSchema[] = [
  {
    body: "Learning JavaScript can be overwhelming with so many resources available. Here's a structured approach that has helped thousands of developers master this essential language.\n\n## Start with the Fundamentals\n\nBefore diving into frameworks, master the core concepts: variables, functions, objects, and arrays. Understanding these building blocks is crucial for writing clean, maintainable code.\n\n## Practice with Real Projects\n\nThe best way to learn is by building actual applications. Start with simple projects like a todo list or calculator, then gradually increase complexity.\n\n## Join the Community\n\nEngage with other developers through forums, Discord servers, and local meetups. The JavaScript community is incredibly welcoming and helpful.",
    description: "A comprehensive guide to mastering JavaScript from beginner to advanced level",
    tagList: ["beginners", "javascript", "programming", "webdev"],
    title: "How to Learn JavaScript Efficiently",
  },
  {
    body: "React Hooks have revolutionized how we write React components, but they come with their own set of best practices and potential pitfalls.\n\n## useEffect Dependencies\n\nOne of the most common mistakes is forgetting to include dependencies in the useEffect array. This can lead to stale closures and unexpected behavior.\n\n## Custom Hooks for Reusability\n\nCreate custom hooks to encapsulate stateful logic that can be shared across components. This promotes code reuse and maintainability.\n\n## Performance Considerations\n\nUse useMemo and useCallback judiciously. Don't optimize prematurely, but be aware of when these hooks can help prevent unnecessary re-renders.",
    description: "Essential patterns and anti-patterns when working with React Hooks",
    tagList: ["frontend", "hooks", "javascript", "react"],
    title: "React Hooks: Best Practices and Common Pitfalls",
  },
  {
    body: "Building scalable APIs requires careful consideration of architecture, error handling, and performance optimization.\n\n## API Design Principles\n\nFollow RESTful conventions and use appropriate HTTP status codes. Design your API to be intuitive and self-documenting.\n\n## Error Handling Strategy\n\nImplement comprehensive error handling with proper logging and monitoring. Use middleware to handle errors consistently across your application.\n\n## Database Optimization\n\nOptimize database queries and consider implementing caching strategies for frequently accessed data. Connection pooling is essential for production applications.",
    description: "Architectural patterns and best practices for creating robust backend services",
    tagList: ["api", "architecture", "backend", "nodejs"],
    title: "Building Scalable APIs with Node.js",
  },
  {
    body: "Machine learning might seem intimidating, but it's more accessible than ever for developers looking to expand their skillset.\n\n## Understanding the Basics\n\nStart with supervised learning concepts like classification and regression. These form the foundation for more complex ML algorithms.\n\n## Practical Tools and Libraries\n\nPython's scikit-learn is perfect for beginners, while TensorFlow and PyTorch offer more advanced capabilities for deep learning projects.\n\n## Data Preprocessing\n\nMost of ML work involves cleaning and preparing data. Learn to handle missing values, normalize features, and split datasets properly.",
    description: "Getting started with ML concepts and practical applications for software developers",
    tagList: ["ai", "datascience", "machinelearning", "python"],
    title: "Introduction to Machine Learning for Developers",
  },
];

const commentsSeed: { body: string; userIdx: number }[][] = [
  [
    {
      body: "Great article! I've been struggling with JavaScript concepts and this really helps clarify things.",
      userIdx: usersSeed.janesmith.index,
    },
    {
      body: "The data preprocessing section is spot on. It's definitely where most of the work happens in ML projects.",
      userIdx: usersSeed.mikewilson.index,
    },
  ],
  [
    {
      body: "useEffect dependencies caught me so many times when I was learning React. Wish I had read this earlier!",
      userIdx: usersSeed.johndoe.index,
    },
    {
      body: "Custom hooks are a game-changer. They make components so much cleaner and more reusable.",
      userIdx: usersSeed.sarahchen.index,
    },
  ],
  [
    {
      body: "Error handling is definitely something I need to improve on. Thanks for the practical tips!",
      userIdx: usersSeed.janesmith.index,
    },
    {
      body: "Connection pooling made such a difference in my API performance. Great advice!",
      userIdx: usersSeed.johndoe.index,
    },
  ],
  [
    {
      body: "As someone new to ML, this is exactly the kind of practical introduction I was looking for.",
      userIdx: usersSeed.janesmith.index,
    },
    {
      body: "The data preprocessing section is spot on. It's definitely where most of the work happens in ML projects.",
      userIdx: usersSeed.mikewilson.index,
    },
  ],
];

const favoritesSeed: number[][] = [
  [usersSeed.mikewilson.index, usersSeed.sarahchen.index],
  [usersSeed.johndoe.index, usersSeed.sarahchen.index],
  [usersSeed.janesmith.index],
  [usersSeed.johndoe.index],
];

const seed = async () => {
  console.log("seeding users...");

  const seededUsers: NewUser[] = await Promise.all(
    Object.entries(usersSeed).map(async ([key, value]) => ({
      bio: value.bio,
      email: value.email,
      hashedPassword: await hashPassword(randomBytes(20).toString("hex")),
      username: key,
    })),
  );

  const newUsers = await db.insert(users).values(seededUsers).returning({
    id: users.id,
    username: users.username,
  });

  console.log("seeding articles...");
  const newArticles = await Promise.all(articlesSeed.map((article, idx) => createArticle(article, newUsers[idx].id)));

  console.log("seeding comments...");

  await db.insert(comments).values(
    newArticles.flatMap((article, idx) =>
      commentsSeed[idx].map((comment) => ({
        articleId: article.id,
        authorId: newUsers[comment.userIdx].id,
        body: comment.body,
      })),
    ),
  );

  console.log("seeding favorited posts...");

  await db.insert(articlesFavorited).values(
    newArticles.flatMap((article, idx) =>
      favoritesSeed[idx].map((favorite) => ({
        articleId: article.id,
        userId: newUsers[favorite].id,
      })),
    ),
  );

  console.log("done");
};

await seed();
process.exit(0);
