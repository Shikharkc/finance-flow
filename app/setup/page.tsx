"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle, ExternalLink, AlertCircle } from "lucide-react"
import { useState } from "react"

export default function SetupPage() {
  const [completed, setCompleted] = useState({
    firebase: false,
    auth: false,
    firestore: false,
    storage: false,
    rules: false,
    storageRules: false,
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Firebase Setup Guide</h1>
          <p className="text-muted-foreground">
            Follow these steps to configure Firebase for your expense tracking app
          </p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You need to complete these setup steps in your Firebase Console before the app will work properly.
          </AlertDescription>
        </Alert>

        {/* Step 1: Create Firebase Project */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  {completed.firebase ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                  Step 1: Create Firebase Project
                </CardTitle>
                <CardDescription>Set up a new Firebase project for your app</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCompleted({ ...completed, firebase: !completed.firebase })}
              >
                {completed.firebase ? "Mark Incomplete" : "Mark Complete"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal space-y-2 pl-5">
              <li>
                Go to the{" "}
                <a
                  href="https://console.firebase.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:underline inline-flex items-center gap-1"
                >
                  Firebase Console <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>Click "Add project" or "Create a project"</li>
              <li>Enter a project name (e.g., "Expense Tracker")</li>
              <li>Follow the setup wizard to complete project creation</li>
              <li>Add a web app and copy your Firebase configuration</li>
            </ol>
          </CardContent>
        </Card>

        {/* Step 2: Enable Authentication */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  {completed.auth ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                  Step 2: Enable Authentication
                </CardTitle>
                <CardDescription>Configure email/password authentication</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setCompleted({ ...completed, auth: !completed.auth })}>
                {completed.auth ? "Mark Incomplete" : "Mark Complete"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal space-y-2 pl-5">
              <li>In Firebase Console, go to "Authentication" in the left sidebar</li>
              <li>Click "Get started" if it's your first time</li>
              <li>Go to the "Sign-in method" tab</li>
              <li>Click on "Email/Password"</li>
              <li>Enable "Email/Password" (the first option)</li>
              <li>Click "Save"</li>
            </ol>
          </CardContent>
        </Card>

        {/* Step 3: Create Firestore Database */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  {completed.firestore ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                  Step 3: Create Firestore Database
                </CardTitle>
                <CardDescription>Set up Cloud Firestore for data storage</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCompleted({ ...completed, firestore: !completed.firestore })}
              >
                {completed.firestore ? "Mark Incomplete" : "Mark Complete"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal space-y-2 pl-5">
              <li>In Firebase Console, go to "Firestore Database" in the left sidebar</li>
              <li>Click "Create database"</li>
              <li>Choose "Start in test mode" (we'll secure it in the next step)</li>
              <li>Select your preferred Firestore location</li>
              <li>Click "Enable"</li>
            </ol>
          </CardContent>
        </Card>

        {/* Step 4: Enable Firebase Storage */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  {completed.storage ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                  Step 4: Enable Firebase Storage
                </CardTitle>
                <CardDescription>Set up Cloud Storage for file uploads (receipts, photos)</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCompleted({ ...completed, storage: !completed.storage })}
              >
                {completed.storage ? "Mark Incomplete" : "Mark Complete"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal space-y-2 pl-5">
              <li>In Firebase Console, go to "Storage" in the left sidebar</li>
              <li>Click "Get started"</li>
              <li>Choose "Start in test mode" (we'll secure it in the next step)</li>
              <li>Select your preferred Storage location (should match Firestore location)</li>
              <li>Click "Done"</li>
            </ol>
          </CardContent>
        </Card>

        {/* Step 5: Set Firestore Security Rules (IMPORTANT) */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  {completed.rules ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                  Step 5: Set Firestore Security Rules (IMPORTANT)
                </CardTitle>
                <CardDescription className="text-orange-600 dark:text-orange-400">
                  This step fixes Firestore "permission-denied" errors
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCompleted({ ...completed, rules: !completed.rules })}
              >
                {completed.rules ? "Mark Incomplete" : "Mark Complete"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal space-y-2 pl-5">
              <li>In Firebase Console, go to "Firestore Database"</li>
              <li>Click on the "Rules" tab at the top</li>
              <li>
                Replace the existing rules with the rules from the{" "}
                <code className="bg-muted px-1 py-0.5 rounded text-sm">firestore.rules</code> file in your project
              </li>
              <li>Click "Publish" to apply the new rules</li>
            </ol>

            <Alert className="bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800">
              <AlertDescription className="text-sm">
                <strong>Security rules summary:</strong> These rules ensure that users can only read and write their own
                data. Each user's expenses, income, budgets, and receipts are protected and isolated.
              </AlertDescription>
            </Alert>

            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-medium mb-2">Quick copy of Firestore rules:</p>
              <pre className="text-xs overflow-x-auto bg-background p-3 rounded border">
                {`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    match /users/{userId} {
      allow read, write: if isOwner(userId);
    }
    
    match /userProfiles/{profileId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }
    
    match /expenses/{expenseId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }
    
    match /income/{incomeId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }
    
    match /budgets/{budgetId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }
    
    match /receipts/{receiptId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }
    
    match /{document=**} {
      allow read, write: if false;
    }
  }
}`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Step 6: Set Storage Security Rules */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  {completed.storageRules ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                  Step 6: Set Storage Security Rules (IMPORTANT)
                </CardTitle>
                <CardDescription className="text-orange-600 dark:text-orange-400">
                  This step fixes Storage "unauthorized" errors for file uploads
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCompleted({ ...completed, storageRules: !completed.storageRules })}
              >
                {completed.storageRules ? "Mark Incomplete" : "Mark Complete"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal space-y-2 pl-5">
              <li>In Firebase Console, go to "Storage"</li>
              <li>Click on the "Rules" tab at the top</li>
              <li>
                Replace the existing rules with the rules from the{" "}
                <code className="bg-muted px-1 py-0.5 rounded text-sm">storage.rules</code> file in your project
              </li>
              <li>Click "Publish" to apply the new rules</li>
            </ol>

            <Alert className="bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800">
              <AlertDescription className="text-sm">
                <strong>Security rules summary:</strong> These rules ensure that users can only upload, read, and delete
                files in their own directory. File uploads are limited to 10MB per file.
              </AlertDescription>
            </Alert>

            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-medium mb-2">Quick copy of Storage rules:</p>
              <pre className="text-xs overflow-x-auto bg-background p-3 rounded border">
                {`rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Users can only access files in their own directory
    match /users/{userId}/{allPaths=**} {
      allow read: if isOwner(userId);
      allow write: if isOwner(userId) && request.resource.size < 10 * 1024 * 1024;
      allow delete: if isOwner(userId);
    }
    
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Final Check */}
        <Card className="border-emerald-200 dark:border-emerald-800">
          <CardHeader>
            <CardTitle>Setup Complete!</CardTitle>
            <CardDescription>Once you've completed all steps, your app should work without errors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Setup Progress:</span>
                <span className="text-sm font-medium">{Object.values(completed).filter(Boolean).length} / 6 steps</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-all duration-300"
                  style={{ width: `${(Object.values(completed).filter(Boolean).length / 6) * 100}%` }}
                />
              </div>
              {Object.values(completed).every(Boolean) && (
                <Alert className="bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <AlertDescription>
                    All setup steps completed! You can now use your expense tracking app with full file upload support.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
