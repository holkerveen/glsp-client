/********************************************************************************
 * Copyright (c) 2019-2022 EclipseSource and others.
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

import { hasArrayProp } from '../utils/type-util';
import { Action, RequestAction, ResponseAction } from './base-protocol';

/**
 * Type hints are used to define what modifications are supported on the different element types.
 * The rationale is to avoid a client-server round-trip for user feedback of each synchronous user interaction.
 */
export interface TypeHint {
    /**
     * The id of the element.
     */
    readonly elementTypeId: string;

    /**
     * Specifies whether the element can be relocated.
     */
    readonly repositionable: boolean;

    /**
     * Specifies whether the element can be deleted
     */
    readonly deletable: boolean;
}

/**
 * A {@link TypeHint} with additional modification properties for shape elements.
 */
export interface ShapeTypeHint extends TypeHint {
    /**
     * Specifies whether the element can be resized.
     */
    readonly resizable: boolean;

    /**
     * Specifies whether the element can be moved to another parent
     */
    readonly reparentable: boolean;

    /**
     * The types of elements that can be contained by this element (if any)
     */
    readonly containableElementTypeIds?: string[];
}

/**
 * A {@link TypeHint} with additional modification properties for edge elements.
 */
export interface EdgeTypeHint extends TypeHint {
    /**
     * Specifies whether the routing of this element can be changed.
     */
    readonly routable: boolean;

    /**
     * Allowed source element types for this edge type
     */
    readonly sourceElementTypeIds: string[];

    /**
     * Allowed targe element types for this edge type
     */
    readonly targetElementTypeIds: string[];
}

/**
 * Sent from the client to the server in order to request hints on whether certain modifications are allowed for a specific element type.
 * The `RequestTypeHintsAction` is optional, but should usually be among the first messages sent from the client to the server after
 * receiving the model via RequestModelAction. The response is a {@link SetTypeHintsAction}.
 * The corresponding namespace declares the action kind as constant and offers helper functions for type guard checks
 * and creating new `RequestTypeHintsActions`.
 */
export interface RequestTypeHintsAction extends RequestAction<SetTypeHintsAction> {
    kind: typeof RequestTypeHintsAction.KIND;
}

export namespace RequestTypeHintsAction {
    export const KIND = 'requestTypeHints';

    export function is(object: any): object is RequestTypeHintsAction {
        return RequestAction.hasKind(object, KIND);
    }

    export function create(options: { requestId?: string } = {}): RequestTypeHintsAction {
        return {
            kind: KIND,
            requestId: '',
            ...options
        };
    }
}

/**
 * Sent from the server to the client in order to provide hints certain modifications are allowed for a specific element type.
 * The corresponding namespace declares the action kind as constant and offers helper functions for type guard checks
 * and creating new `SetTypeHintsActions`.
 */
export interface SetTypeHintsAction extends ResponseAction {
    kind: typeof SetTypeHintsAction.KIND;

    shapeHints: ShapeTypeHint[];

    edgeHints: EdgeTypeHint[];
}

export namespace SetTypeHintsAction {
    export const KIND = 'setTypeHints';

    export function is(object: any): object is SetTypeHintsAction {
        return Action.hasKind(object, KIND) && hasArrayProp(object, 'shapeHints') && hasArrayProp(object, 'edgeHints');
    }

    export function create(options: { shapeHints: ShapeTypeHint[]; edgeHints: EdgeTypeHint[]; responseId?: string }): SetTypeHintsAction {
        return {
            kind: KIND,
            responseId: '',
            ...options
        };
    }
}
