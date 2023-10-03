/********************************************************************************
 * Copyright (c) 2023 Business Informatics Group (TU Wien) and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import { IActionHandler, ViewerOptions, TYPES, Action } from '~glsp-sprotty';
import { EnableDefaultToolsAction } from '../../base/tool-manager/tool';
import { injectable, inject } from 'inversify';
import { FocusDomAction } from '../accessibility/actions';
import { IDiagramStartup } from '../../base/model/diagram-loader';

/**
 * Focuses the graph on different actions.
 */
@injectable()
export class RestoreViewportHandler implements IActionHandler, IDiagramStartup {
    protected readonly graphSelector = '[data-svg-metadata-type="graph"]';

    @inject(TYPES.ViewerOptions) protected options: ViewerOptions;

    handle(action: Action): void | Action {
        if (EnableDefaultToolsAction.is(action) || (FocusDomAction.is(action) && action.id === 'graph')) {
            this.focusGraph();
        }
    }

    async postRequestModel(): Promise<void> {
        await this.waitForElement(this.graphSelector);
        this.focusGraph();
    }

    protected focusGraph(): void {
        const container = document.getElementById(this.options.baseDiv)?.querySelector(this.graphSelector) as HTMLElement | null;
        container?.focus();
    }

    // https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
    protected waitForElement(selector: string): Promise<Element | null> {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }
}
