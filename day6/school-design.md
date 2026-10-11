# School Database Design

## 1. Tables

**Students:** The `students` table stores each student's ID, name and email address. The ID is the primary key, and the email is unique so that two students cannot register with the same email address.

**Courses:** The `courses` table stores the ID and name of each course. The ID is the primary key, while the course name is required and unique.

**Enrolments:** The `enrolments` table records which students take which courses. It contains its own ID, the student ID, the course ID and the student's grade. The student ID and course ID are foreign keys that reference the `students` and `courses` tables. A unique constraint on these two foreign keys prevents a student from enrolling in the same course more than once.

## 2. Relationships

The relationship between students and enrolments is one-to-many because one student can have several enrolment records, while each enrolment belongs to one student. The relationship between courses and enrolments is also one-to-many because one course can have several enrolment records, while each enrolment refers to one course.

Students and courses therefore have a many-to-many relationship: a student can take several courses, and a course can have several students. The `enrolments` table serves as a join table that connects them and stores additional information, such as each student's grade. Without this table, it would be difficult to represent these relationships properly while enforcing the database constraints.

## 3. Recommended Index

I would add an index on `enrolments(course_id)` because the system frequently needs to find students enrolled in a particular course and count enrolments per course. The index can help SQLite locate matching enrolment records more efficiently as the database grows. The unique constraint on `(student_id, course_id)` already creates an index that can support searches using the student ID first.

## 4. SQL or NoSQL?

I would choose a relational SQL database such as SQLite for this school system. Students, courses and enrolments have clear relationships, and foreign keys and unique constraints help maintain accurate records. SQL also supports joins, grouping and counting, which are useful for producing course lists and enrolment reports. A NoSQL database could work, but its flexible document structure is less necessary for this data model. SQLite is a suitable choice for a small school system because it is lightweight and does not require a separate database server.
