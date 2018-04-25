﻿import * as React from 'react'
import { Dic, classes } from '../Globals'
import * as Navigator from '../Navigator'
import { ResultTable, FindOptions, FilterOption, QueryDescription } from '../FindOptions'
import { Entity, Lite, is, toLite, JavascriptMessage, getToString, EntityPack, ModelState, ModifiableEntity } from '../Signum.Entities'
import { TypeContext, StyleOptions } from '../TypeContext'
import { getTypeInfo, TypeInfo, PropertyRoute, ReadonlyBinding, getTypeInfos } from '../Reflection'
import { Transition } from 'react-transition-group'

import "./Notify.css"

type NotifyType = "warning" | "error" | "success" | "loading";

interface NotifyOptions {
    text: React.ReactChild;
    type: NotifyType;
}

interface NotifyState {
    text?: React.ReactChild;
    type?: NotifyType;
}


export default class Notify extends React.Component<{}, NotifyState>{

    static singletone: Notify;

    constructor(props: {}) {
        super(props);
        this.state = { text: undefined, type: undefined };

        Notify.singletone = this;
    }

    _isMounted: boolean = false;
    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handler?: number;
    notifyTimeout(options: NotifyOptions, timeout: number = 2000) {
        this.notify(options);
        this.handler = setTimeout(() => this.clear(), timeout);
    }

    notify(options: NotifyOptions) {
        if (!this._isMounted)
            return;
        if (this.handler != undefined) {
            clearTimeout(this.handler);
            this.handler = undefined;
        }
        this.setState(options);
    }

    clear() {
        if (!this._isMounted)
            return;
        if (this.handler != undefined) {
            clearTimeout(this.handler);
            this.handler = undefined;
        }
        this.setState({ text: undefined, type: undefined })
    }


    notifyPendingRequest(pending: number) {
        if (pending)
            this.notify({ text: JavascriptMessage.loading.niceToString(), type: "loading" });
        else
            this.clear();
    }

    getIcon() {
        if (!this.state.type) {
            return undefined;
        }

        var icon: string | undefined;
        switch (this.state.type) {
            case "loading":
                icon = "fa fa-cog fa-spin fa-fw";
                break;
            case "error":
            case "warning":
                icon = "fa fa-exclamation fa-fw";
                break;
            case "success":
                icon = "fa fa-check fa-fw";
                break;
            default:
                break;
        }

        if (icon) {
            return <span className={icon} style={{ fontSize: "large" }}> </span>
        }
        else {
            return undefined;
        }
    }

    render() {        
        return (
            <div id="sfNotify">
                <Transition in={this.state.text != undefined} timeout={200}>
                    {(state: string) => <span className={classes(this.state.type, "notify", state == "entering" || state == "entered" ? "in" : undefined)}>{this.getIcon()}{this.state.text}</span>}
                </Transition>
            </div>
        );
    }
}

