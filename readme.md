# MessMate — Project Overview

MessMate is an expense and meal tracker for shared dining groups (messes). Managers can manage members, meal rates, deposits, and expenses, while members can track their meal consumption.

For local setup and running instructions, see the Local Development Setup guide at [messmate-frontend/README.md](https://github.com/iarafathossain/messmate-frontend)

## Key Features

- User registration and login for mess managers and members
- JWT-based API authentication and role-based access
- Member registration using a mess code
- Meal rate management and daily meal records
- Mess expense and member deposit tracking
- Meal sheet viewing for members

## Database Schema & Relationships

The database uses PostgreSQL and Prisma ORM.

### Authentication (`auth.prisma`)

- `User`: stores user information and credentials.
- `Role`: stores available roles, such as `mess` and `member`.
- `UserRole`: associates users with roles.

A unique constraint on `UserRole.userId` ensures each user has at most one role, while each role can belong to multiple users. This design supports future role expansion without relying on an enum.

### Mess Management

- `Mess` → `User`: one-to-many; a mess can have multiple users, while a user belongs to at most one mess.
- `Mess` → `MessMember`: one-to-many; tracks mess membership.
- `Mess` → `MealRecord`: one-to-many; stores daily meal records.
- `Mess` → `MessExpense`: one-to-many; stores mess expenses.

Each meal record and expense belongs to one mess. The `MessMember` model manages the relationship between a mess and its members.

## Main Flows

### Authentication

1. Users register as mess managers or members and log in.
2. The system assigns a role and issues a JWT for authenticated API requests.
3. Users access features according to their role.

### Mess Management

1. A manager registers a mess.
2. Members join using the mess code.
3. The manager configures meal rates and records daily meals.
4. The manager records deposits and mess expenses.
5. Members view their meal sheets and related information.

## Backend Tech Stack

- Node.js, Express.js, TypeScript
- PostgreSQL, Prisma ORM
- JWT authentication
- npm

### Backend Architecture

- Modular architecture separating authentication, mess, meal, and expense management.
- Each module contains relevant routes, controllers, services, interfaces, and validators.
- A shared `catchAsync` utility handles asynchronous errors.
- A common API response interface maintains consistent response structures.

## Frontend Tech Stack

- Next.js 16
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form and TanStack Table

### Frontend Architecture

- Route groups and nested routing for organized navigation.
- Reusable, component-based UI architecture.

## Limitations & Future Improvements

- Monthly meal sheets and monthly expense/deposit summaries.
- Inline deposit and expense entry.
- Highest/lowest monthly statistics.
- Weekly meal planning and AI-powered healthy meal recommendations.

### Planned AI Feature

Store meal menus and ingredient information in the database, then explore AI-based meal recommendations using user preferences and dietary restrictions.
