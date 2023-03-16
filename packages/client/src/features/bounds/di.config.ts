/********************************************************************************
 * Copyright (c) 2022-2023 EclipseSource and others.
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
import { bindAsService } from '@eclipse-glsp/protocol';
import { ContainerModule } from 'inversify';
import {
    configureCommand,
    configureLayout,
    HBoxLayouter,
    HiddenBoundsUpdater,
    Layouter,
    LayoutRegistry,
    RequestBoundsCommand,
    SetBoundsCommand,
    VBoxLayouter
} from 'sprotty';
import { TYPES } from '../../base/types';
import { FreeFormLayouter } from './freeform-layout';
import { GLSPHiddenBoundsUpdater } from './glsp-hidden-bounds-updater';
import { HBoxLayouterExt } from './hbox-layout';
import { VBoxLayouterExt } from './vbox-layout';

const glspBoundsModule = new ContainerModule((bind, _unbind, isBound, _rebind) => {
    const context = { bind, isBound };
    configureCommand(context, SetBoundsCommand);
    configureCommand(context, RequestBoundsCommand);
    bind(HiddenBoundsUpdater).toSelf().inSingletonScope();
    bindAsService(context, TYPES.HiddenVNodePostprocessor, GLSPHiddenBoundsUpdater);
    bind(TYPES.Layouter).to(Layouter).inSingletonScope();
    bind(TYPES.LayoutRegistry).to(LayoutRegistry).inSingletonScope();

    configureLayout(context, VBoxLayouter.KIND, VBoxLayouterExt);
    configureLayout(context, HBoxLayouter.KIND, HBoxLayouterExt);
    configureLayout(context, FreeFormLayouter.KIND, FreeFormLayouter);
});

export default glspBoundsModule;
