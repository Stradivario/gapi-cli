#! /usr/bin/env node
export declare const QuestionsType: {
    username: "username";
    password: "password";
    project: "project";
};
export declare type QuestionsType = keyof typeof QuestionsType;
export interface Questions {
    passwordQuestion(): void;
    projectQuestion(): void;
    usernameQuestion(): void;
}
export interface Tasks {
    usernameTask(username: string): void;
    projectTask(name: string): void;
    passwordTask(password: string): void;
}
export declare class DeployTask implements Tasks, Questions {
    private readlineService;
    private deploy_config;
    spinner: any;
    run(): Promise<void>;
    passwordQuestion(): Promise<void>;
    projectQuestion(): Promise<void>;
    usernameQuestion(): Promise<void>;
    usernameTask(username: string): void;
    projectTask(name: string): void;
    passwordTask(password: string): void;
    validateUserConfig(question: QuestionsType): Promise<void>;
}
