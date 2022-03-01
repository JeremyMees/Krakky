import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { UpdateUserImg } from '../models/update-img.model';
import { CUSTOM_CHARACTER } from '../data/custom-character';
import { CustomCharacter } from '../models/character-customization.model';
import { Character } from '../models/character.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  avatar_options: CustomCharacter = CUSTOM_CHARACTER;

  constructor(private http: HttpClient) {}

  public generateRandomAvatar(): string {
    let query_obj: Character = {};
    for (const [key, value] of Object.entries(this.avatar_options)) {
      switch (key) {
        case 'earrings':
          const earrings: { [key: string]: string } =
            this._randomizerEarrings();
          for (const [key, value] of Object.entries(earrings)) {
            query_obj[key] = value;
          }
          break;
        case 'glasses':
          const glasses: { [key: string]: string } = this._randomizerGlasses();
          for (const [key, value] of Object.entries(glasses)) {
            query_obj[key] = value;
          }
          break;
        case 'facialHair':
          undefined;
          break;
        case 'eyeShadowColor':
          undefined;
          break;
        case 'earringColor':
          undefined;
          break;
        case 'glassesColor':
          undefined;
          break;
        case 'earringsProbability':
          undefined;
          break;
        case 'glassesProbability':
          undefined;
          break;
        case 'facialHairProbability':
          undefined;
          break;
        default:
          query_obj[key] =
            this.avatar_options[key][this.randomizer(value.length)];
      }
    }
    return this._generateImgQuery(query_obj);
  }

  private _randomizerEarrings(): { [key: string]: string } {
    const random_number: number = this.randomizer(11);
    let query_obj: { [key: string]: string } = {};
    if (random_number >= 7) {
      query_obj.earringsProbability = '100';
      query_obj.earrings =
        this.avatar_options.earrings[
          this.randomizer(this.avatar_options.earrings.length)
        ];
      query_obj.earringColor =
        this.avatar_options.earringColor[
          this.randomizer(this.avatar_options.earringColor.length)
        ];
    } else {
      query_obj.earringsProbability = '0';
    }
    return query_obj;
  }

  private _randomizerGlasses(): { [key: string]: string } {
    const random_number: number = this.randomizer(11);
    let query_obj: { [key: string]: string } = {};
    if (random_number >= 5) {
      query_obj.glassesProbability = '100';
      query_obj.glasses =
        this.avatar_options.glasses[
          this.randomizer(this.avatar_options.glasses.length)
        ];
      query_obj.glassesColor =
        this.avatar_options.glassesColor[
          this.randomizer(this.avatar_options.glassesColor.length)
        ];
    } else {
      query_obj.glassesProbability = '0';
    }
    return query_obj;
  }

  public randomizer(max: number): number {
    max--;
    return Math.floor(Math.random() * (max - 0 + 1)) + 0;
  }

  private _generateImgQuery(queryObj: Character): string {
    let img_query: string = '?';
    for (const [key, value] of Object.entries(queryObj)) {
      img_query += `${key}=${value}&`;
    }
    img_query = img_query.slice(0, -1);
    return img_query;
  }

  public updateUserImage(user: UpdateUserImg): Observable<HttpResponse> {
    return this.http.patch<HttpResponse>(
      `${environment.base_url}/user/img`,
      user
    );
  }
}
