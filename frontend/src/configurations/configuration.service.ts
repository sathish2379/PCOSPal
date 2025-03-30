import { Injectable } from "@angular/core";
import { config, defaults } from "./configuration";

@Injectable({
  providedIn: "root",
})
export class ConfigService {
  getConfig() {
    return config;
  }

  getDefaults() {
    return defaults;
  }
}
