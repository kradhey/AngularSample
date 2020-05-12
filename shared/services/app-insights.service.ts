import { Injectable } from '@angular/core';

declare var appInsights: any;

@Injectable()
export class AppInsightsService {
    trackPageView(page: string) {
        appInsights.trackPageView(page);
    }

    trackEvent(eventName: string, details: any = null) {
        appInsights.trackEvent(eventName, details);
    }

    trackException(ex: any) {
        appInsights.trackException(ex);
    }

    trackTrace(message: string, category: string = null) {
        appInsights.trackTrace(message, category);
    }
}