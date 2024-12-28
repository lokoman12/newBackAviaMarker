import { Injectable, Logger } from "@nestjs/common";
import { AsyncTask, CronJob, Job, ToadScheduler } from "toad-scheduler";

@Injectable()
export class ExternalScheduler {
  private readonly logger = new Logger(ExternalScheduler.name);

  constructor(
    private readonly scheduler: ToadScheduler
  ) { 
    // this.logger.log('Сервис инициализирован!')
  }

  addJob(taskId: string, cronExpression: string, callback: () => Promise<void>) {
    const task = new AsyncTask(
      taskId,
      () => {
        return callback().then(() => {
          this.logger.log(`Джоба ${taskId} завершена`);
        })
      },
      (e: Error) => {
        this.logger.warn(`Джоба ${taskId} завершилась с ошибкой: ${e}`);
      }
    );

    const job = new CronJob({ cronExpression, }, task,
      {
        id: taskId,
        preventOverrun: true,
      }
    );
    this.scheduler.addCronJob(job);
  }

  cancelJobByName(taskId: string) {
    this.logger.log(`Удаляем джобу ${taskId}`);
    if (!taskId) {
      this.logger.warn(`Джоба с пустым taskId не может быть удалена!`);
      return;
    }
    const job = this.scheduler.getById(taskId);
    if (!job.id) {
      this.logger.warn(`Джобы ${taskId} нет в системе!`);
      return;
    }
    this.logger.log('Пробуем удалить')
    this.scheduler.stopById(taskId);
  }

  getJobs(): Array<Job> {
    return this.scheduler.getAllJobs();
  }

  isJobExistsByName(id: string): boolean {
    if (!id) {
      return false;
    }
    // const job = this.scheduler.getById(id);
    // return job?.id != undefined;
    return this.scheduler.existsById(id);
  }

  getJobByName(id: string): Job | undefined {
    if (!id) {
      return undefined;
    }
    const job = this.scheduler.getById(id);
    return job;
  }
}