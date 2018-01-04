import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-skill',
  templateUrl: './skill.component.html',
  styleUrls: ['./skill.component.scss']
})
export class SkillComponent implements OnInit {
    @Input() skill: any;
    @Input() form: FormGroup;

    constructor() { }

    ngOnInit() {
  }

}
