/********************************************************************************
 * Copyright (c) 2019-2023 EclipseSource and others.
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
import { ContainerModule } from 'inversify';
import { ContextMenuProviderRegistry, IContextMenuService, TYPES, bindAsService } from '~glsp-sprotty';
import { SelectionServiceAwareContextMenuMouseListener } from './selection-service-aware-context-menu-mouse-listener';
import { ServerContextMenuItemProvider } from './server-context-menu-provider';

const glspContextMenuModule = new ContainerModule(bind => {
    bind(TYPES.IContextMenuServiceProvider).toProvider<IContextMenuService>(
        ctx => () =>
            new Promise<IContextMenuService>((resolve, reject) => {
                if (ctx.container.isBound(TYPES.IContextMenuService)) {
                    resolve(ctx.container.get<IContextMenuService>(TYPES.IContextMenuService));
                } else {
                    reject();
                }
            })
    );
    bindAsService(bind, TYPES.MouseListener, SelectionServiceAwareContextMenuMouseListener);
    bind(TYPES.IContextMenuProviderRegistry).to(ContextMenuProviderRegistry);
    bindAsService(bind, TYPES.IContextMenuItemProvider, ServerContextMenuItemProvider);
});

export default glspContextMenuModule;
