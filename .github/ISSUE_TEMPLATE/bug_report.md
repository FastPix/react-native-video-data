---
name: Bug Report
about: Report a bug or unexpected behavior in the FastPix React Native Video Data SDK
title: '[BUG] '
labels: ['bug', 'needs-triage']
assignees: ''
---

# Bug Report

Thank you for taking the time to report a bug with the FastPix React Native Video Data SDK. To help us resolve your issue quickly and efficiently, please provide the following information:

## Description
**Clear and concise description of the bug:**
```
<!-- Please provide a detailed description of what you're experiencing -->
```

## Environment Information

### System Details
- **React Native Version:** [e.g., 0.72.0, 0.73.0, 0.74.0]
- **React Version:** [e.g., 18.1.0, 19.0.0]
- **Node.js Version:** [e.g., 18.x, 20.x]
- **Operating System:** [e.g., macOS 14.0, Windows 11, Ubuntu 22.04]
- **Platform:** [e.g., iOS, Android, Both]
- **iOS Version:** [e.g., iOS 15.0, iOS 16.0] (if applicable)
- **Android Version:** [e.g., Android 12, Android 13] (if applicable)

### SDK Information
- **FastPix React Native Video Data SDK Version:** [e.g., 1.0.1, 1.0.0]
- **Package Manager:** [e.g., npm, yarn, pnpm]
- **Development Environment:** [e.g., Expo, React Native CLI]

## Reproduction Steps

1. **Setup Environment:**
   ```bash
   npm install @fastpix/react-native-video-data
   # or
   yarn add @fastpix/react-native-video-data
   ```

2. **Code to Reproduce:**
   ```javascript
   // Please provide a minimal, reproducible example
   import { FastPixVideoData } from '@fastpix/react-native-video-data';
   import React, { useEffect } from 'react';

   const App = () => {
     useEffect(() => {
       const videoData = new FastPixVideoData({
         apiKey: 'your-api-key',
       });

       // Your code here that causes the issue
     }, []);

     return null;
   };

   export default App;
   ```

3. **Expected Behavior:**

    ```
    <!-- Describe what you expected to happen -->
    ```

4. **Actual Behavior:**

    ```
    <!-- Describe what actually happened -->
    ```

5. **Error Messages/Logs:**
   ```
   <!-- Paste any error messages, stack traces, or logs here -->
   ```

## Debugging Information

### Console Output
```
<!-- Paste the complete console output here -->
```

### Error Stack Traces
```javascript
// Complete stack trace for JavaScript/React Native errors
Error: Error message here
    at SomeComponent (SomeComponent.js:123:45)
    at YourComponent (YourComponent.js:45:12)
```

### Native Logs
```
<!-- iOS: Xcode console logs or Android: Logcat output -->
```

### HTTP Requests
```http
# Raw HTTP request (remove sensitive headers and credentials)
POST /api/endpoint HTTP/1.1
Host: [FastPix API endpoint]
Authorization: Bearer ***
Content-Type: application/json

<!-- Remove credentials and sensitive headers before pasting -->
```

### Screenshots
```
<!-- If applicable, please attach screenshots that help explain your issue -->
```

## Additional Context

### Configuration
```javascript
// Please share your SDK configuration (remove sensitive information)
import { FastPixVideoData } from '@fastpix/react-native-video-data';

const videoData = new FastPixVideoData({
  apiKey: '***', // Redacted
  // Any other configuration options
});
```

### Project Configuration
- **metro.config.js:** [Any custom Metro configuration]
- **babel.config.js:** [Any custom Babel configuration]
- **app.json / app.config.js:** [Expo configuration if applicable]

### Workarounds
```
<!-- If you've found any workarounds, please describe them here -->
```

## Priority
Please indicate the priority of this bug:

- [ ] Critical (Blocks production use)
- [ ] High (Significant impact on functionality)
- [ ] Medium (Minor impact)
- [ ] Low (Nice to have)

## Checklist
Before submitting, please ensure:

- [ ] I have searched existing issues to avoid duplicates
- [ ] I have provided all required information
- [ ] I have tested with the latest SDK version
- [ ] I have removed any sensitive information (API keys, credentials, etc.)
- [ ] I have provided a minimal reproduction case
- [ ] I have checked the documentation
- [ ] I have tested on both iOS and Android (if applicable)

---

**Thank you for helping improve the FastPix React Native Video Data SDK! 🚀**

