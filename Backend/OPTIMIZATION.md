# Backend Optimization Guide for MongoDB M0 Cluster

## Overview

This guide outlines the optimizations implemented to ensure optimal performance with MongoDB M0 cluster (shared cluster with limited resources).

## Key Optimizations Implemented

### 1. Database Connection Optimization

- **Connection Pooling**: Limited to 10 max connections to avoid overwhelming M0 cluster
- **Idle Connection Management**: Closes idle connections after 30 seconds
- **Write Concern**: Optimized for performance (w: 1, j: false)
- **Read Preference**: Primary preferred with secondary fallback
- **Removed Deprecated Options**: Removed useNewUrlParser and useUnifiedTopology

### 2. Query Optimization

- **Compound Indexes**: Created for common query patterns
- **Text Search Indexes**: Optimized with weights for better relevance
- **Projection**: Only fetch required fields using `.select()` or projection
- **Lean Queries**: Use `.lean()` for read-only operations
- **Pagination Limits**: Capped at 50 items per page
- **Parallel Queries**: Use `Promise.all()` for independent queries

### 3. Caching Strategy

- **In-Memory Cache**: 5-minute TTL for frequently accessed data
- **Route-Specific Caching**: Different cache durations for different endpoints
- **Cache Invalidation**: Automatic cleanup of expired entries
- **Admin Cache Management**: Endpoints to monitor and clear cache

### 4. Response Optimization

- **Compression**: Gzip compression for responses > 1KB
- **Rate Limiting**: Prevents abuse and reduces server load
- **Security Headers**: Helmet.js for security without performance impact
- **Static File Caching**: 1-day cache for uploaded files

### 5. Performance Monitoring

- **Response Time Tracking**: Monitor slow queries (> 1 second)
- **Error Rate Monitoring**: Track and log errors
- **Memory Usage**: Monitor application memory consumption
- **Database Health**: Track connection status and performance

## Index Strategy

### User Model

```javascript
// Single field indexes
{ phone: 1 } (unique)
{ role: 1 }
{ isActive: 1 }

// Compound indexes
{ role: 1, isActive: 1 }
{ name: 1, storeName: 1 }

// Text search
{ name: "text", storeName: "text" } (with weights)

// Timestamp
{ createdAt: -1 }
```

### Product Model

```javascript
// Single field indexes
{ category: 1 }
{ isAvailable: 1 }
{ price: 1 }
{ stock: 1 }

// Compound indexes
{ category: 1, isAvailable: 1 }
{ isAvailable: 1, price: 1 }
{ category: 1, price: 1 }

// Text search
{ name: "text", description: "text" } (with weights)

// Timestamps
{ createdAt: -1 }
{ updatedAt: -1 }
```

### Order Model

```javascript
// Single field indexes
{ user: 1 }
{ status: 1 }
{ orderDate: -1 }
{ totalAmount: 1 }

// Compound indexes
{ user: 1, status: 1 }
{ user: 1, orderDate: -1 }
{ status: 1, orderDate: -1 }
{ user: 1, status: 1, orderDate: -1 }
```

## Best Practices for M0 Cluster

### 1. Query Optimization

- Always use indexes for WHERE clauses
- Limit result sets with pagination
- Use projection to fetch only needed fields
- Avoid sorting on non-indexed fields
- Use compound indexes for multi-field queries

### 2. Connection Management

- Keep connection pool size moderate (10-20)
- Monitor connection usage
- Implement proper error handling
- Use connection timeouts

### 3. Caching Strategy

- Cache frequently accessed, rarely changed data
- Implement cache invalidation
- Monitor cache hit rates
- Use appropriate TTL values

### 4. Monitoring

- Track response times
- Monitor error rates
- Watch memory usage
- Check database connection health

## Performance Endpoints

### Health Check

```
GET /health
```

### Performance Stats (Admin)

```
GET /api/admin/performance/stats
POST /api/admin/performance/reset
```

### Cache Management (Admin)

```
GET /api/admin/cache/stats
DELETE /api/admin/cache/clear
```

### System Performance

```
GET /api/performance
```

## Monitoring Guidelines

### Response Time Targets

- **Fast**: < 200ms
- **Acceptable**: 200ms - 1s
- **Slow**: > 1s (logged for investigation)

### Error Rate Targets

- **Good**: < 1%
- **Acceptable**: 1% - 5%
- **Poor**: > 5% (requires investigation)

### Memory Usage

- Monitor heap usage
- Watch for memory leaks
- Restart if memory usage > 80%

## Troubleshooting

### Slow Queries

1. Check if proper indexes exist
2. Use MongoDB explain() to analyze query plans
3. Consider query optimization
4. Implement caching if appropriate

### High Memory Usage

1. Check for memory leaks
2. Reduce cache size
3. Implement garbage collection
4. Consider connection pool reduction

### Connection Issues

1. Check network connectivity
2. Verify connection string
3. Monitor connection pool usage
4. Implement retry logic

## Future Optimizations

1. **Redis Caching**: For distributed caching
2. **CDN**: For static file delivery
3. **Database Sharding**: When data grows significantly
4. **Microservices**: For better scalability
5. **Load Balancing**: For high availability

## Environment Variables

```env
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## Deployment Considerations

1. **Environment**: Set NODE_ENV=production
2. **Logging**: Implement proper logging
3. **Monitoring**: Set up application monitoring
4. **Backup**: Regular database backups
5. **Security**: Implement proper security measures
