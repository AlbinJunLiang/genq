import { Component } from '@angular/core';
import { HeroSection } from "../hero-section/hero-section";
import { InformationSection } from "../information-section/information-section";

@Component({
  selector: 'app-home',
  imports: [HeroSection, InformationSection],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

}
