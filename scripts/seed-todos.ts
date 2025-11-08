import { db } from "../src/db";
import { todos, type InsertTodo } from "../src/db/schema";

const todoTitles = [
  "Buy groceries",
  "Finish project report",
  "Call dentist for appointment",
  "Update resume",
  "Clean the garage",
  "Review pull requests",
  "Plan weekend trip",
  "Read documentation",
  "Fix bug in production",
  "Organize desk",
  "Schedule team meeting",
  "Write blog post",
  "Learn new framework",
  "Refactor legacy code",
  "Update dependencies",
  "Deploy to production",
  "Review quarterly goals",
  "Prepare presentation",
  "Research competitors",
  "Optimize database queries",
  "Setup CI/CD pipeline",
  "Write unit tests",
  "Document API endpoints",
  "Design new feature",
  "Conduct user research",
  "Analyze performance metrics",
  "Create mockups",
  "Update changelog",
  "Review security audit",
  "Implement dark mode",
  "Setup monitoring",
  "Train new team member",
  "Plan sprint backlog",
  "Update project roadmap",
  "Fix accessibility issues",
  "Optimize images",
  "Setup error tracking",
  "Write integration tests",
  "Review code standards",
  "Update technical debt",
  "Implement new API",
  "Setup authentication",
  "Create user dashboard",
  "Optimize bundle size",
  "Setup analytics",
  "Review user feedback",
  "Update privacy policy",
  "Implement caching",
  "Setup backup system",
  "Review metrics dashboard",
];

const descriptions = [
  "This is a high priority task that needs attention",
  "Make sure to complete this before the deadline",
  "Low priority but should be done eventually",
  "Important for the upcoming release",
  "Quick task that can be done in 15 minutes",
  "Complex task requiring careful planning",
  "Needs coordination with other team members",
  "Blocked by external dependencies",
  "Nice to have feature",
  "Critical for production stability",
  "User requested feature",
  "Technical improvement",
  "Performance optimization needed",
  "Security enhancement",
  "Documentation update required",
  "Bug fix for reported issue",
  "Refactoring opportunity",
  "Design improvement",
  "Code cleanup task",
  "Infrastructure improvement",
];

async function seedTodos() {
  console.log("🌱 Starting to seed todos...");

  const count = 50; // Number of todos to create
  const todosToInsert: InsertTodo[] = [];

  for (let i = 0; i < count; i++) {
    const title = todoTitles[i % todoTitles.length];
    const description = descriptions[i % descriptions.length];
    const completed = Math.random() > 0.7; // 30% chance of being completed
    const createdAt =
      Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000); // Random date within last 30 days

    todosToInsert.push({
      title: `${title} #${i + 1}`,
      description,
      completed,
      createdAt,
    });
  }

  try {
    const result = await db.insert(todos).values(todosToInsert);
    console.log(`✅ Successfully inserted ${count} todos!`);
    console.log(`📊 Stats:`);
    console.log(`   - Total todos: ${count}`);
    console.log(
      `   - Completed: ${todosToInsert.filter((t) => t.completed).length}`
    );
    console.log(
      `   - Active: ${todosToInsert.filter((t) => !t.completed).length}`
    );
  } catch (error) {
    console.error("❌ Error seeding todos:", error);
    process.exit(1);
  }

  process.exit(0);
}

seedTodos();
