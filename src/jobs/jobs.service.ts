import { Injectable } from '@nestjs/common';
import { Job, JobDocument } from './job.schema';
import { CreateJobDto } from './dtos/create-job-dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JobDetails } from './job-details.interface';
import { AuthRecruter } from 'src/authentification/authRecruter/models/auth-recruter.model';
@Injectable()
export class JobsService {
    constructor(@InjectModel('Job') private jobModel: Model<JobDocument>) { }
    _getJobDetails(job: JobDocument): JobDetails {
        return {
            id: job._id,
            poste: job.poste,
            typeContrat: job.typeContrat,
            secteur: job.secteur,
            langue: job.langue,
            genre: job.genre,
            description: job.description,
            competences: job.competences,
            dateExpiration: job.dateExpiration,
            motsCles: job.motsCles
        };
    }
    
    async create(job: CreateJobDto,recruter:AuthRecruter): Promise<JobDetails> {
        const createdJob = new this.jobModel({
            poste: job.poste,
            typeContrat: job.typeContrat,
            secteur: job.secteur,
            langue: job.langue,
            genre: job.genre,
            description: job.description,
            competences: job.competences,
            dateExpiration: job.dateExpiration,
            motsCles: job.motsCles,
            recruter
        });
        createdJob.save()
        console.log(createdJob);
        
        return this._getJobDetails(createdJob );
    }

    async findAll() {
        return this.jobModel.find().populate('recruter').exec();
    }

    async findAllByRecruter(id : string) {
        return this.jobModel.find( {recruter:id} ).exec();
    }

    async findBySector(secteur:any) {
        return this.jobModel.find({secteur:secteur});
    }
    
    async findByContract(contract:any) {
        
        return this.jobModel.find({typeContrat:contract});
    }

    async findOne(id:string): Promise<Job> {
        return this.jobModel.findById(id).populate('recruter').exec();
    }
}