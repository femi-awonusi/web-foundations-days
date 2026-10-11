-- Day 6 Assignment: A School Database

-- 1. Students table
CREATE TABLE students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

-- 2. Courses table
CREATE TABLE courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_name TEXT NOT NULL UNIQUE
);

-- 3. Enrolments table
CREATE TABLE enrolments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade TEXT,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    UNIQUE (student_id, course_id)
);

-- 4. Insert sample students
INSERT INTO students (name, email)
VALUES
    ('Femi Adeyinka', 'femi@example.com'),
    ('Ada Okafor', 'ada@example.com'),
    ('Tunde Bello', 'tunde@example.com');

-- 5. Insert sample courses
INSERT INTO courses (course_name)
VALUES
    ('Database Systems'),
    ('Web Development'),
    ('Cybersecurity');

-- 6. Insert sample enrolments
INSERT INTO enrolments (student_id, course_id, grade)
VALUES
    (1, 1, 'A'),
    (1, 2, 'B'),
    (2, 1, 'B'),
    (2, 3, 'A'),
    (3, 2, 'A'),
    (3, 3, 'C');

-- 7. Find all courses for one student
SELECT
    students.name,
    courses.course_name
FROM students
JOIN enrolments
    ON students.id = enrolments.student_id
JOIN courses
    ON enrolments.course_id = courses.id
WHERE students.name = 'Femi Adeyinka';

-- 8. Find all students on one course
SELECT
    students.name,
    courses.course_name
FROM students
JOIN enrolments
    ON students.id = enrolments.student_id
JOIN courses
    ON enrolments.course_id = courses.id
WHERE courses.course_name = 'Database Systems';

-- 9. Count students per course
SELECT
    courses.course_name,
    COUNT(enrolments.student_id) AS total_students
FROM courses
LEFT JOIN enrolments
    ON courses.id = enrolments.course_id
GROUP BY courses.id, courses.course_name
ORDER BY courses.course_name;

-- 10. Find students who have no enrolments
SELECT
    students.id,
    students.name,
    students.email
FROM students
LEFT JOIN enrolments
    ON students.id = enrolments.student_id
WHERE enrolments.id IS NULL;

-- 11. Update one enrolment's grade
UPDATE enrolments
SET grade = 'A'
WHERE student_id = 2
  AND course_id = 1;

-- 12. Index to speed up searches by course
CREATE INDEX idx_enrolments_course_id
ON enrolments(course_id);

