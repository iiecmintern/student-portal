# MongoDB Atlas Setup Guide

This guide will help you migrate from local MongoDB to MongoDB Atlas and manage your database environments.

## 🚀 Quick Start

### 1. Switch to Production Environment

```bash
# Switch to use MongoDB Atlas
node switch-env.js production

# Or manually set in .env file
NODE_ENV=production
```

### 2. Migrate Data to Atlas

```bash
# Migrate all data from local MongoDB to Atlas
npm run migrate:atlas

# Migrate with backup creation
npm run migrate:backup
```

### 3. Start Application with Atlas

```bash
# Start in production mode (uses Atlas)
npm run start:prod

# Or start normally (will use Atlas if NODE_ENV=production)
npm start
```

## 📋 Available Scripts

| Script                           | Description                                       |
| -------------------------------- | ------------------------------------------------- |
| `npm run start:prod`             | Start application in production mode (uses Atlas) |
| `npm run migrate:atlas`          | Migrate data from local MongoDB to Atlas          |
| `npm run migrate:backup`         | Migrate data and create backup file               |
| `node switch-env.js production`  | Switch to production environment                  |
| `node switch-env.js development` | Switch to development environment                 |

## 🔧 Environment Configuration

Your `.env` file should contain:

```env
# Development (Local MongoDB)
MONGODB_URI=mongodb://localhost:27017/global_lms

# Production (MongoDB Atlas)
MONGODB_URI_PROD=mongodb+srv://username:password@cluster.mongodb.net/global_lms

# Environment
NODE_ENV=development  # or production
```

## 🌍 Environment Switching

### Development Mode (Local MongoDB)

```bash
node switch-env.js development
npm run dev
```

### Production Mode (MongoDB Atlas)

```bash
node switch-env.js production
npm run start:prod
```

## 📊 Database Migration

### Before Migration

1. Ensure your local MongoDB is running
2. Verify your Atlas connection string is correct
3. Make sure you have network access to Atlas

### Run Migration

```bash
npm run migrate:atlas
```

### Migration Process

1. Connects to local MongoDB
2. Exports all data from all collections
3. Connects to MongoDB Atlas
4. Imports all data to Atlas
5. Creates backup file (`backup-data.json`)

### Collections Migrated

- Users
- Courses
- Lessons
- Quizzes
- Enrollments
- Certificates
- Notifications
- Affiliations
- Franchises
- Lesson Progress
- Quiz Attempts

## 🔍 Verification

### Check Connection

When you start the application, you should see:

```
✅ MongoDB Connected: mern.suqdd.mongodb.net
🌍 Environment: production
🗄️  Database: global_lms
```

### Test API Endpoints

```bash
# Health check
curl http://localhost:3001/health

# Get courses
curl http://localhost:3001/api/courses
```

## 🛠️ Troubleshooting

### Connection Issues

1. **Network Error**: Check your internet connection
2. **Authentication Error**: Verify username/password in Atlas connection string
3. **IP Whitelist**: Add your IP to Atlas Network Access
4. **Cluster Status**: Ensure Atlas cluster is active

### Migration Issues

1. **Data Loss**: Check `backup-data.json` for your data
2. **Duplicate Data**: Migration script clears existing Atlas data
3. **Large Datasets**: Migration may take time for large datasets

### Performance Issues

1. **Connection Pool**: Atlas connection is optimized for performance
2. **Indexes**: Ensure proper indexes are created
3. **Query Optimization**: Monitor slow queries in Atlas

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit `.env` to version control
2. **Connection String**: Use environment variables for Atlas URI
3. **Network Access**: Restrict IP access in Atlas
4. **Database User**: Use dedicated database user with minimal privileges

## 📈 Monitoring

### Atlas Dashboard

- Monitor cluster performance
- Check connection metrics
- View slow queries
- Monitor storage usage

### Application Logs

- Connection status
- Query performance
- Error tracking
- Migration progress

## 🔄 Rollback

If you need to rollback to local MongoDB:

1. **Switch Environment**:

   ```bash
   node switch-env.js development
   ```

2. **Restore from Backup** (if needed):

   ```bash
   # Use the backup-data.json file to restore data
   ```

3. **Start Application**:
   ```bash
   npm run dev
   ```

## 📞 Support

If you encounter issues:

1. Check the application logs
2. Verify Atlas cluster status
3. Test connection string
4. Review network access settings
5. Check environment variables

---

**Note**: Always backup your data before making any changes to your database configuration.
