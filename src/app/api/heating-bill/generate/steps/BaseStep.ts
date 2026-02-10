import { HeatingBillContext } from "../context/HeatingBillContext";

export interface IHeatingBillGenerationStep {
    execute(context: HeatingBillContext): Promise<void>;
}

export abstract class BaseStep implements IHeatingBillGenerationStep {
    abstract execute(context: HeatingBillContext): Promise<void>;
}
