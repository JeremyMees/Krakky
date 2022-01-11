import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartOptions } from 'chart.js';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Card } from 'src/app/card/models/card.model';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { User } from 'src/app/user/models/user.model';
import { UserService } from 'src/app/user/services/user.service';
import { CHART_OPTIONS } from '../../data/chart_options';
import { AggregatedDashboard } from '../../models/aggregated-dashboard.model';
import { GraphData } from '../../models/graph-data.model';
import { GraphDataset } from '../../models/graph-dataset.model';
import { SocketDashboardService } from '../../service/socket-dashboard.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  providers: [MessageService],
})
export class StatisticsComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject();
  loading: boolean = true;
  found: boolean = false;
  user!: User;
  dashboard!: AggregatedDashboard;
  cards_all: Array<Card> = [];
  cards_completed: Array<Card> = [];
  cards_doing: Array<Card> = [];
  cards_overdue: Array<Card> = [];
  cards_backlog: Array<Card> = [];
  chart_options: ChartOptions = CHART_OPTIONS;
  period: number = 7;
  new_period: number = 7;
  periods: Array<{ name: string; number: number }> = [
    { name: '1 week', number: 7 },
    { name: '2 weeks', number: 14 },
    { name: '3 weeks', number: 21 },
    { name: '4 weeks', number: 28 },
    { name: '5 weeks', number: 35 },
  ];
  data: GraphData | undefined;

  constructor(
    public route: ActivatedRoute,
    private userService: UserService,
    private messageService: MessageService,
    private socketDashboardService: SocketDashboardService,
    public router: Router
  ) {}

  public ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      if (params.id) {
        this._onGetCurrentUser();
        this._subscribeDashboard(params.id);
      } else {
        this._onFinish(false);
      }
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.socketDashboardService.disconnect();
  }

  private _subscribeDashboard(id: string): void {
    this.socketDashboardService
      .onSubscribeDashboard(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: HttpResponse) => {
          if (res.statusCode === 200 || res.statusCode === 201) {
            this.dashboard = res.data;
            this.cards_all = res.data.cards;
            this._onTransformData(res.data.cards);
          } else {
            this._showSnackbar('error', 'Error while updating dashboard');
          }
        },
        error: () => {
          this._notFound();
        },
      });
  }

  private _onTransformData(cards: Array<Card>): void {
    this._onResetCards();
    cards.forEach((card: Card) => {
      this._oncheckIfCardCompleted(card);
      this._oncheckIfCardDoing(card);
      this._oncheckIfCardOverdue(card);
      this._oncheckIfCardBacklog(card);
    });
    this._onTransformGraphData();
    this._onFinish(true);
  }

  private _oncheckIfCardDoing(card: Card): void {
    if (card.start_date && !card.completion_date) {
      this.cards_doing.push(card);
    }
  }

  private _oncheckIfCardOverdue(card: Card): void {
    if (this._onCheckDueDate(card.due_date)) {
      this.cards_overdue.push(card);
    }
  }

  private _oncheckIfCardBacklog(card: Card): void {
    if (!card.completion_date && !card.start_date) {
      this.cards_backlog.push(card);
    }
  }

  private _oncheckIfCardCompleted(card: Card): void {
    if (card.completion_date) {
      this.cards_completed.push(card);
    }
  }

  private _onCheckDueDate(date: Date | undefined): boolean {
    if (date) {
      const due_date: Date = new Date(date);
      const now: Date = new Date();
      now.setHours(0, 0, 0, 0);
      return due_date < now ? true : false;
    } else {
      return false;
    }
  }

  private _onResetCards(): void {
    this.cards_completed = [];
    this.cards_doing = [];
    this.cards_overdue = [];
    this.cards_backlog = [];
  }

  private _onGetCurrentUser(): void {
    this.userService
      .getCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.user = user as User;
      });
  }

  private _notFound(): void {
    this._onFinish(false);
    this._showSnackbar('error', "Couldn't find dashboard");
  }

  private _onFinish(found: boolean): void {
    this.found = found;
    this.loading = false;
  }

  public onChangePeriod(): void {
    if (this.period === this.new_period) return;
    this.period = this.new_period;
    this._onTransformGraphData();
  }

  private _onTransformGraphData(): void {
    this.data = {
      labels: this._onGenerateLabels(),
      datasets: [
        this._onTransformGraphDataCompleted(),
        this._onTransformGraphDataUpdated(),
        this._onTransformGraphDataOverdue(),
      ],
    };
  }

  private _onGenerateLabels(): Array<string> {
    const labels: Array<string> = [];
    for (let i = 0; i < this.period; i++) {
      let date: Date = new Date(Date.now());
      if (i > 0) date = new Date(Date.now() - 86400000 * i);
      const day: string = `${date.getDate()}`;
      const month: string = `/${date.getMonth() + 1}`;
      labels.push(day.padStart(2, '0') + month);
    }
    return labels.reverse();
  }

  private _onTransformGraphDataCompleted(): GraphDataset {
    const data: Array<number> = [];
    for (let i = 0; i < this.period; i++) {
      let date: Date = new Date(Date.now());
      if (i > 0) date = new Date(Date.now() - 86400000 * i);
      const cards: Array<Card> = this.cards_completed.filter((card: Card) =>
        this._onCheckIfSameDay(card.completion_date as Date, date)
      );
      data.push(cards ? cards.length : 0);
    }
    return {
      label: 'Completed cards',
      data: data.reverse(),
      fill: false,
      borderColor: '#00BB7E',
      tension: 0.3,
    };
  }

  private _onTransformGraphDataUpdated(): GraphDataset {
    const data: Array<number> = [];
    for (let i = 0; i < this.period; i++) {
      let date: Date = new Date(Date.now());
      if (i > 0) date = new Date(Date.now() - 86400000 * i);
      const cards: Array<Card> = this.cards_all.filter((card: Card) =>
        this._onCheckIfSameDay(Number(card.updated_at), date)
      );
      data.push(cards ? cards.length : 0);
    }
    return {
      label: 'Updated cards',
      data: data.reverse(),
      fill: false,
      borderColor: '#0d89ec',
      tension: 0.3,
    };
  }

  private _onTransformGraphDataOverdue(): GraphDataset {
    const data: Array<number> = [];
    for (let i = 0; i < this.period; i++) {
      let date: Date = new Date(Date.now());
      if (i > 0) date = new Date(Date.now() - 86400000 * i);
      const cards: Array<Card> = this.cards_overdue.filter((card: Card) =>
        this._onCheckIfSameDay(card.due_date!, date)
      );
      data.push(cards ? cards.length : 0);
    }
    return {
      label: 'Overdue cards',
      data: this._onCalculateGraphDataOverdue(data),
      fill: false,
      borderColor: '#C02929',
      tension: 0.3,
    };
  }

  private _onCalculateGraphDataOverdue(data: Array<number>): Array<number> {
    data.reverse();
    let sum: number = 0;
    data.forEach((num: number, index: number) => {
      data[index] = num + sum;
      sum += num;
    });
    return data;
  }

  private _onCheckIfSameDay(
    date_1: Date | number,
    date_2: Date | number
  ): boolean {
    const date_one: Date = new Date(date_1);
    const date_two: Date = new Date(date_2);
    if (
      date_one.getDate() === date_two.getDate() &&
      date_one.getMonth() === date_two.getMonth() &&
      date_one.getFullYear() === date_two.getFullYear()
    ) {
      return true;
    } else {
      return false;
    }
  }

  private _showSnackbar(severity: string, detail: string): void {
    this.messageService.add({
      severity,
      detail,
    });
  }
}
