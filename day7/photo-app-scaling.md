# Day 7 Assignment: Scaling a Photo-Sharing App

## 1. Assumptions

SnapShare is a photo-sharing application where users upload photos and view a feed of photos from people they follow.

The following assumptions are used:

- SnapShare has 10 million registered users.
- 10% of registered users are active each day.
- Each daily active user uploads one photo per day.
- Each daily active user views 50 feed pages per day.
- Each original photo averages 2 MB.
- Each photo has one thumbnail averaging 50 KB.
- The system operates 365 days per year.
- Average request rates are calculated across 86,400 seconds per day.
- Peak feed traffic is estimated at five times the average rate.
- Storage estimates use decimal units: 1 GB = 1,000 MB and 1 TB = 1,000 GB.
- Storage estimates exclude backups, replicas, metadata, and additional image variants.

## 2. Traffic and Storage Estimates

### Daily Active Users

Daily active users (DAU) = 10,000,000 × 10%

DAU = 1,000,000 users.

### Uploads Per Second

Daily uploads = 1,000,000 users × 1 photo

Daily uploads = 1,000,000 photos.

Average uploads per second = 1,000,000 ÷ 86,400

Average uploads per second ≈ 11.57, or approximately 12 uploads per second.

### Feed Views Per Second

Daily feed views = 1,000,000 users × 50 views

Daily feed views = 50,000,000 feed pages.

Average feed views per second = 50,000,000 ÷ 86,400

Average feed views per second ≈ 579.

Peak feed views per second = (50,000,000 ÷ 86,400) × 5

Peak feed views per second ≈ 2,894.

These figures represent feed-page requests, excluding additional requests for individual photos and thumbnails.

### Photo Storage Per Year

Original photo storage per day:

1,000,000 × 2 MB = 2,000,000 MB = 2 TB.

Original photo storage per year:

2 TB × 365 = 730 TB.

Thumbnail storage per day:

1,000,000 × 50 KB = 50,000,000 KB = 50 GB.

Thumbnail storage per year:

50 GB × 365 = 18.25 TB.

Total annual image storage:

730 TB + 18.25 TB = 748.25 TB.

SnapShare therefore requires approximately 748.25 TB of additional image storage per year, excluding backups, replicas, metadata, and other overhead.

## 3. Read-Heavy or Write-Heavy?

SnapShare is a read-heavy system. Each active user uploads one photo but views 50 feed pages per day, producing a 50:1 ratio of feed views to uploads.

The architecture should therefore prioritise fast feed delivery and efficient read handling. A cache can reduce repeated database queries, a read replica can handle additional database reads, and a content delivery network (CDN) can serve images closer to users. The primary database remains responsible for writes and authoritative records.

## 4. Why Photos Should Not Be Stored Inside the Database

Original photos and thumbnails should be stored in object storage rather than as large binary files inside the relational database.

Storing image files in the database would increase database size, backup and recovery costs, and the resources required for database operations. Object storage is better suited to large files and can scale independently of the database.

The database should store photo metadata, such as the photo ID, uploader ID, object-storage key, caption, upload time, and visibility settings. The actual image files should reside in object storage, with a CDN delivering frequently requested images and thumbnails.

## 5. Architecture Diagram

```text
                         USERS
                           |
                +----------+----------+
                |                     |
          Feed/API Requests      Image Requests
                |                     |
        +-------v-------+        +----v----+
        | Load Balancer |        |   CDN   |
        +-------+-------+        +----+----+
                |                     |
        +-------v-------+        +----v----------+
        | App Servers   |        | Object Storage|
        | (API Services)|        | Originals and |
        +---+---+---+---+        | Thumbnails    |
            |   |   |            +---------------+
            |   |   |
            |   |   +----------------------+
            |   |                          |
      +-----v+  +----------+         +-----v------+
      | Cache|  | Primary  |         | Upload API |
      |      |  | Database |         +-----+------+
      +------+  +-----+----+               |
                       |                    |
                 Replication          +----v----------+
                       |              | Object Storage|
                +------v------+       +---------------+
                | Read Replica|               |
                +-------------+         +-----v------+
                                        | Job Queue   |
                                        +-----+-------+
                                              |
                                        +-----v-------+
                                        | Thumbnail   |
                                        | Worker      |
                                        +-----+-------+
                                              |
                                        +-----v-------+
                                        | Object      |
                                        | Storage     |
                                        +-------------+
```

The diagram separates image delivery, application processing, database operations, and background image processing. The primary database replicates data to the read replica. The upload API stores originals in object storage and places thumbnail jobs on a queue.

## 6. What Each Component Does

- **Users:** Upload photos and request feed pages and images.
- **Load balancer:** Distributes incoming application requests across available app servers.
- **App servers:** Authenticate requests, enforce permissions, process feed queries, and coordinate application operations.
- **Cache:** Stores frequently accessed feed data and metadata to reduce database queries and improve response times.
- **Primary database:** Stores authoritative application records, including users, relationships, photo metadata, and feed-related information.
- **Read replica:** Serves eligible database read queries using replicated data, reducing read pressure on the primary database.
- **CDN:** Delivers cached photos and thumbnails from locations closer to users, reducing latency and repeated requests to the origin.
- **Object storage:** Stores original photos and thumbnails independently of the relational database.
- **Upload API:** Validates photo uploads, checks permissions and limits, stores originals, records metadata, and initiates thumbnail processing.
- **Job queue:** Holds thumbnail-generation tasks so image processing can happen asynchronously and jobs can be retried when appropriate.
- **Thumbnail worker:** Consumes queued jobs, creates smaller image versions, and stores the thumbnails in object storage.

## 7. Step-by-Step Photo Upload Flow

1. A user selects a photo and submits it through the application.
2. The load balancer directs the upload request to an available app server or upload API.
3. The application authenticates the user and validates the file type, file size, permissions, and applicable upload limits.
4. The upload API stores the original photo in object storage and obtains its storage key.
5. The application records the photo metadata and storage key in the primary database.
6. The application places a thumbnail-generation job on the queue, containing the photo identifier and the information needed to locate the original.
7. The application returns an upload confirmation when the original has been stored and the required metadata has been committed. Thumbnail processing may still be pending.
8. A thumbnail worker retrieves the queued job and reads the original photo from object storage.
9. The worker generates a thumbnail and saves it to object storage.
10. The application makes the thumbnail available for feed delivery, and the CDN can cache it when requested.

The queue separates upload handling from thumbnail generation. If thumbnail processing is delayed, the original can remain available while the thumbnail job waits for a worker.

The implementation must handle partial failures. For example, if the original upload succeeds but the database write fails, the system needs a retry or cleanup strategy to prevent orphaned files. Database and queue updates should also be designed so that a committed photo is not permanently left without its thumbnail job.

## 8. Trade-Offs

### Trade-Off 1: Caching Versus Data Freshness

Caching improves feed performance and reduces database load, but cached data can become stale. New photos, deleted posts, or changed visibility settings may not appear immediately unless the cache is invalidated or updated. SnapShare must balance fast feed delivery with timely updates and correct access permissions.

### Trade-Off 2: Asynchronous Thumbnail Processing Versus Immediate Availability

Using a queue keeps upload requests fast and allows thumbnail workers to scale independently. However, thumbnails may not be ready immediately after an upload. The application must handle pending thumbnails, retry failed jobs, and monitor queue delays.

### Trade-Off 3: Read Replicas Versus Read Consistency

Read replicas distribute database read traffic, but replication lag can cause a recently uploaded photo or updated record to be temporarily missing from a read. The application may need to read recent changes from the primary database when immediate consistency is required.

### Trade-Off 4: Object Storage and CDN Versus Operational Complexity

Object storage and a CDN scale image delivery efficiently, but introduce additional costs, access-control requirements, cache invalidation concerns, and configuration complexity. Private photos require appropriate authorisation and carefully designed CDN access controls.

## 9. Conclusion

SnapShare's estimated workload is one million uploads and 50 million feed views per day. It requires approximately 12 average uploads per second, 579 average feed-page requests per second, and 2,894 peak feed-page requests per second. Annual image storage grows by approximately 748.25 TB before overhead.

A scalable design separates image files from database records, uses object storage and a CDN for image delivery, distributes application traffic through a load balancer, reduces repeated reads with caching and a read replica, and processes thumbnails asynchronously through a queue and workers.
