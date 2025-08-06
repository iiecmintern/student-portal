# S3 Bucket Setup Guide - Fix Upload Issues

## 🚨 Current Issue

Your S3 bucket has "Block Public Access" settings enabled, preventing file uploads.

## 🔧 Step-by-Step Fix

### 1. Access AWS S3 Console

- Go to [AWS S3 Console](https://console.aws.amazon.com/s3/)
- Navigate to your bucket: `global-lms-uploads-eduflow`

### 2. Disable Block Public Access

1. **Select your bucket** (`global-lms-uploads-eduflow`)
2. **Click "Permissions" tab**
3. **Scroll to "Block public access (bucket settings)"**
4. **Click "Edit"**
5. **Uncheck ALL boxes:**
   - ✅ Block all public access
   - ✅ Block public access to buckets and objects granted through new access control lists (ACLs)
   - ✅ Block public access to buckets and objects granted through any access control lists (ACLs)
   - ✅ Block public access to buckets and objects granted through new public bucket or access point policies
   - ✅ Block public access to buckets and objects granted through any public bucket or access point policies
6. **Click "Save changes"**
7. **Type "confirm" and click "Confirm"**

### 3. Update Bucket Policy

1. **Still in "Permissions" tab**
2. **Click "Bucket policy"**
3. **Click "Edit"**
4. **Replace with this policy:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::global-lms-uploads-eduflow/*"
    },
    {
      "Sid": "AllowIAMUserUpload",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::991791270471:user/MainDeployIAMrole"
      },
      "Action": ["s3:PutObject", "s3:PutObjectAcl", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::global-lms-uploads-eduflow/*"
    }
  ]
}
```

5. **Click "Save changes"**

### 4. Update CORS Configuration

1. **Click "CORS" in the left sidebar**
2. **Click "Edit"**
3. **Replace with this configuration:**

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"]
  }
]
```

4. **Click "Save changes"**

### 5. Verify IAM User Permissions

1. **Go to [IAM Console](https://console.aws.amazon.com/iam/)**
2. **Find user: `MainDeployIAMrole`**
3. **Attach this policy if not already attached:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::global-lms-uploads-eduflow/*"
    }
  ]
}
```

## 🧪 Test the Fix

After making these changes:

1. **Wait 2-3 minutes** for changes to propagate
2. **Try uploading a file** in your application
3. **Check Render logs** for successful uploads

## 🔍 Alternative Quick Fix

If you want to test immediately without changing bucket settings, you can temporarily modify the S3 upload code to not use ACLs:
