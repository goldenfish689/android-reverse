import android.accessibilityservice.AccessibilityService;
import android.accessibilityservice.AccessibilityServiceInfo;
import android.text.TextUtils;
import android.util.Log;
import android.view.accessibility.AccessibilityEvent;


/*2026-8-4 edited by Li*/

public final class GPayForegroundAccessibilityController {

    private static final String TAG = "GPayA11yController";


    public static final String GPAY_PACKAGE = "com.google.android.apps.nbu.paisa.user";

    private final AccessibilityService service;

    private boolean gpayForeground;
    private boolean savedIncludeNotImportantViews;
    private boolean hasSavedFlag;
    private String lastForegroundPackage;

    public GPayForegroundAccessibilityController(AccessibilityService service) {
        if (service == null) {
            throw new IllegalArgumentException("service == null");
        }
        this.service = service;
    }

  
    public void onAccessibilityEvent(AccessibilityEvent event) {
        if (event == null || event.getPackageName() == null) {
            return;
        }

        final int type = event.getEventType();
        if (type != AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED
                && type != AccessibilityEvent.TYPE_WINDOWS_CHANGED
                && type != AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED) {
            return;
        }

        final String packageName = event.getPackageName().toString();
        if (TextUtils.isEmpty(packageName)) {
            return;
        }

        // 这里无需重复调用 setServiceInfo。
        if (TextUtils.equals(lastForegroundPackage, packageName)) {
            return;
        }
        lastForegroundPackage = packageName;

        final boolean nowGPayForeground = GPAY_PACKAGE.equals(packageName);
        if (nowGPayForeground == gpayForeground) {
            return;
        }

        gpayForeground = nowGPayForeground;
        if (gpayForeground) {
            onGPayEntered();
        } else {
            onGPayLeft();
        }
    }

    private void onGPayEntered() {
        final AccessibilityServiceInfo info = service.getServiceInfo();
        if (info == null) {
            Log.w(TAG, "GPay entered, but getServiceInfo() returned null");
            return;
        }

        savedIncludeNotImportantViews =
                (info.flags
                        & AccessibilityServiceInfo.FLAG_INCLUDE_NOT_IMPORTANT_VIEWS) != 0;
        hasSavedFlag = true;

        final int oldFlags = info.flags;
        info.flags &= ~AccessibilityServiceInfo.FLAG_INCLUDE_NOT_IMPORTANT_VIEWS;

        if (info.flags != oldFlags) {
            service.setServiceInfo(info);
        }

        Log.i(TAG, "gpay_enter: flags 0x"
                + Integer.toHexString(oldFlags)
                + " -> 0x"
                + Integer.toHexString(info.flags));
    }

    private void onGPayLeft() {
        final AccessibilityServiceInfo info = service.getServiceInfo();
        if (info == null) {
            Log.w(TAG, "GPay left, but getServiceInfo() returned null");
            return;
        }

        final int oldFlags = info.flags;

        if (hasSavedFlag && savedIncludeNotImportantViews) {
            info.flags |= AccessibilityServiceInfo.FLAG_INCLUDE_NOT_IMPORTANT_VIEWS;
        } else {
            info.flags &= ~AccessibilityServiceInfo.FLAG_INCLUDE_NOT_IMPORTANT_VIEWS;
        }

        hasSavedFlag = false;

        if (info.flags != oldFlags) {
            service.setServiceInfo(info);
        }

        Log.i(TAG, "gpay_leave: flags 0x"
                + Integer.toHexString(oldFlags)
                + " -> 0x"
                + Integer.toHexString(info.flags));
    }

    public boolean isGPayForeground() {
        return gpayForeground;
    }

    public String getLastForegroundPackage() {
        return lastForegroundPackage;
    }
}
