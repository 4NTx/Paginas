import { Injectable } from "@angular/core";
import { Title } from "@angular/platform-browser";

@Injectable({ providedIn: 'root' })

export class TitleService {

    private baseTitle = 'REXLAB';

    constructor(private titleService: Title) { }

    setTitle(placeholder?: string) {
        const newTitle = placeholder ? `${this.baseTitle} ${placeholder}` : this.baseTitle;
        this.titleService.setTitle(newTitle);
    }
}