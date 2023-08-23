# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:
-keep class io.realm.react.util.** { *; }
-keep class com.facebook.soloader.** { *; }
-keep class io.realm.react.bridge.** { *; }
-keep class com.facebook.react.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class amdroid.os.Handler.** { *; }
-keep class amdroid.os.Looper.** { *; }
-keep class java.lang.System** { *; }
-keep class java.lang.Runtime.** { *; }
-keep class java.lang.Thread.** { *; }
-keep class java.lang.ClassNotFoundException.** { *; }