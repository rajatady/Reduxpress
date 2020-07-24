/// <reference types="node" />
/// <reference types="express" />

import {Request, Response} from "express";
import {Document, Model, Mongoose} from "mongoose";
import {ReduxPress} from "./index";

declare module 'express' {

    export interface Request {
        redux?: ReduxPress
    }
}


declare namespace r {
    // @ts-ignore

    export function mount(request?: Request, response?: Response): void;

    export function setOptions(options: IReduxOptions): void;

    export function registerFilter(name: string, executorFn: (data, next) => any, hookName?: string);

    export function getTestDouble(options?: IReduxOptions) : ReduxPress;

    export interface ReduxPress {
        invokeAcl(aclString: string): ReduxPress

        currentUser: CurrentUser;

        model: ReduxModel;

        response: any;

        request: any;

        utils: any;

        logger: any;

        addTag(tags: string | string[]): void;

        setCurrentUser(user: CurrentUser);

        attachData(path: string, data: string): this;

        attachData(options: AttachmentOptions[]): this;

        suppressAuthError() : this;

        invokeAcl(value: string, debug?: boolean): this;

        queryValidator(request: Request, params: string[]): Promise<any>;

        paramsValidator(request: Request, params: string[]): Promise<any>;

        headersValidator(request: Request, params: string[]): Promise<any[]>;

        bodyValidator(request: Request, params: string[] | Model<any>): Promise<Document[] | any>;

        requestValidator(request: Request, params: string[] | Model<any>, inBody: boolean): Promise<any[]>;

        tokenValidator(request: Request, token?: string): Promise<CurrentUser>;

        putInterceptor(request: Request, bodyParams: string[] | Model<any>, params: string[]): Promise<Document[] | any>;

        interceptor(request: Request, params: string[] | Model<any>, findWhere: string): Promise<Document | any>;

        generateToken(user: CurrentUser, accessTokenTime?: number, refreshTokenTime?: number, unit?: string): Promise<TokenData>;

        verifyToken(request: string | Request): Promise<CurrentUser>;

        verifyRefreshToken(request: string | Request, suppressError? : boolean): Promise<CurrentUser>;

        issueNewToken(refreshToken : string, user: CurrentUser,  accessTokenTime?: number, refreshTokenTime?: number, unit?: string): Promise<TokenData>;

        generateOTP(secret: string, options?: OTPOptions): Promise<string>;

        verifyOTP(secret: string, OTP: string, options?: OTPOptions): Promise<boolean>;

        err(data: Error | any): void

        printTrace(): void;

        printInitMessage(): void;

        log(data: any, title?: string): void

        setExtra(key: string, value: any): this;

        sendJSON(response: Response, data?: any, status?: number): void;

        sendSuccess(response: Response, data: any, name?: string): Response

        sendError(response: Response, error: Error | string, statusCode?: number): Response

        generateError(code: number, message?: string): ReduxError;

        filter(filterNameOrFunction: (data, next) => any | string, hookName?: string)

    }

    export interface IReduxOptions {
        saveTrace?: boolean;
        supressInitMessage?: boolean;
        ipHeader?: string;
        mongooseInstance?: Mongoose;
        extendIpData?: boolean;
        engine?: string;
        auth?: IReduxAuthOptions;
        authCallback?: (n: number) => any;
        onError?: (error: Error, model : ReduxModel) => any;
        secret?: string;
    }

    export interface IReduxAuthOptions {
        external?: boolean;
        apiUrl?: string;
        method?: string;
        oauthToken?: string;
        scope?: string;
    }

    export interface TokenData {
        x_access_token: string;
        x_refresh_token: string;
        access_token_exp?: string;
        refresh_token_exp?: string;
    }

    export interface OTPOptions {
        step?: number;
        digits?: number;
    }

    export interface ReduxError {
        code: number;
        message?: string;
    }

    export interface ReduxModel {
        route: string;
        ipAddress: string;
        ipDetails?: any;
        metaData?: any;
        version: string;
        trace: any[];
        sessionId?: string;
        method: string;
        userAgent: string;
        appAgent?: string
        accessToken?: string;
        accessTokenHash?: string;
        refreshToken?: string;
        resolved?: boolean;
        ttr?: number;
        userId?: string;
        user?: string;
        query?: string;
        body?: string;
        params?: string;
        tags?: any[];
        paths: string;
        originalUrl: string;
    }

    export interface AttachmentOptions {
        path: string;
        data: string;
    }

    export interface CurrentUser {
        name: string;
        email: string;
        role: string;
        _id: string;
        mobile: string;
    }
}

export = r;


