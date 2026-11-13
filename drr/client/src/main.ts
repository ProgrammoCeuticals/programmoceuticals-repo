import { bootstrapApplication } from "@angular/platform-browser";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { AppComponent } from "./app/app.component";

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withInterceptors([
        (req, next) => {
          const token = localStorage.getItem("drr_token");
          return next(token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req);
        }
      ])
    )
  ]
}).catch((error) => console.error(error));
