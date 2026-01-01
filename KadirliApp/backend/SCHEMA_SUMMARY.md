# Prisma Schema Summary

This document provides an overview of the database schema created for the Kadirli App backend.

## 📊 Database Overview

The schema includes **15 main models** with proper relationships, indexes, and PostgreSQL native enums for type safety.

## 🔢 Enums

### AdType
- `second_hand` - Second-hand items
- `zero_product` - New products
- `real_estate` - Real estate
- `vehicle` - Vehicles
- `service` - Services & Rentals
- `spare_parts` - Spare parts

### AnnouncementType
- `electricity` - Electricity outages
- `water` - Water outages
- `institution` - Official institution announcements
- `education` - Education/Exam announcements
- `general` - General announcements

### TaxiRequestStatus
- `pending` - Request pending
- `accepted` - Request accepted by driver
- `in_progress` - Trip in progress
- `completed` - Trip completed
- `cancelled` - Request cancelled

## 👤 User & Authentication

### User Model
- **Fields**: id, email, phone, fullName, neighborhood, notificationPreferences (JSONB), appMetadata, userMetadata
- **Relations**:
  - One-to-Many with `Ad` (user can have multiple ads)
  - One-to-Many with `TaxiRequest` (user can make multiple taxi requests)
  - One-to-Many with `GuideItem` (user can own taxi businesses)

## 🛒 Marketplace

### Ad Model
- **Fields**: id, title, description, type (AdType enum), contactInfo, price, imageUrls (array), expiresAt, isActive, isDeleted, sellerName, latitude, longitude
- **Relations**:
  - Many-to-One with `User` (optional - ads can be anonymous)
- **Indexes**: userId, isActive+isDeleted, type

## 🗺️ City Guide

### GuideCategory Model
- **Fields**: id, title, iconName, rank
- **Relations**:
  - One-to-Many with `GuideItem`

### GuideItem Model
- **Fields**: id, categoryId, title, phone, address, latitude, longitude, isCenter, isBusy (for taxi drivers), rank
- **Relations**:
  - Many-to-One with `GuideCategory`
  - Many-to-One with `User` (owner - for taxi drivers)
  - One-to-Many with `TaxiRequest` (if it's a taxi)
- **Indexes**: categoryId, ownerId, rank

## 🚕 Taxi System

### TaxiRequest Model
- **Fields**: id, passengerPhone, pickupLatitude, pickupLongitude, status (TaxiRequestStatus enum)
- **Relations**:
  - Many-to-One with `User` (passenger)
  - Many-to-One with `GuideItem` (taxi driver)
- **Indexes**: userId, taxiId, status

## 🚌 Transport System

### TransportRoute Model
- **Fields**: id, title, startTime (TIME), endTime (TIME), frequencyMin
- **Relations**:
  - One-to-Many with `RouteStop`

### TransportStop Model
- **Fields**: id, name, latitude, longitude
- **Relations**:
  - One-to-Many with `RouteStop`

### RouteStop Model (Junction Table)
- **Fields**: id, routeId, stopId, minutesFromStart
- **Relations**:
  - Many-to-One with `TransportRoute`
  - Many-to-One with `TransportStop`
- **Unique Constraint**: routeId + stopId (prevents duplicate stops on same route)

### IntercityTrip Model
- **Fields**: id, destination, companyName, departureTimes (array of TIME strings), price

## 📋 Information Services

### Pharmacy Model
- **Fields**: id, name, phone, address, region, latitude, longitude, dutyDate (DATE)
- **Indexes**: dutyDate, region

### DeathNotice Model
- **Fields**: id, firstName, lastName, deathDate (DATE), burialPlace, burialTime (TIME), condolenceAddress, latitude, longitude, imageUrl
- **Indexes**: deathDate, createdAt

### Announcement Model
- **Fields**: id, title, description, type (AnnouncementType enum), institutionName, imageUrl, fileUrl, targetNeighborhoods (array)
- **Indexes**: type, createdAt

### Event Model
- **Fields**: id, title, description, eventDate, locationName, latitude, longitude, imageUrl, isActive
- **Indexes**: eventDate, isActive

### Campaign Model
- **Fields**: id, title, businessName, description, discountCode, imageUrls (array)
- **Indexes**: createdAt

### Place Model
- **Fields**: id, title, description, distanceText, distanceKm, latitude, longitude, imageUrls (array)
- **Indexes**: distanceKm, createdAt

## 🔗 Key Relationships

1. **User → Ads**: One user can create multiple ads
2. **User → TaxiRequests**: One user can make multiple taxi requests
3. **User → GuideItems**: One user can own multiple taxi businesses (via ownerId)
4. **GuideCategory → GuideItems**: One category has many items
5. **GuideItem → TaxiRequests**: One taxi (GuideItem) can have many requests
6. **TransportRoute → RouteStop**: Many-to-Many relationship via RouteStop junction table
7. **TransportStop → RouteStop**: Many-to-Many relationship via RouteStop junction table

## 📝 Important Notes

- All models have `createdAt` and `updatedAt` timestamps
- UUIDs are used for all primary keys
- Soft deletes are implemented for `Ad` model (isDeleted flag)
- JSONB is used for `User.notificationPreferences` and metadata fields
- Arrays are used for: imageUrls, departureTimes, targetNeighborhoods
- Geographic coordinates use `Float` type (latitude/longitude)
- Date/Time fields use appropriate PostgreSQL types (DATE, TIME, TIMESTAMP)

## 🚀 Next Steps

1. Review the schema for any adjustments
2. Run `npm run prisma:generate` to generate Prisma Client
3. Run `npm run prisma:migrate` to create the database tables
4. Start implementing controllers and routes module by module

