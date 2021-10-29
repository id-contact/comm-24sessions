import React from 'react';
import DoneIcon from '@material-ui/icons/Done';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import translations from '../translations';

type Attributes = [string, string];

export type OrderedGuestAttributes = {
    attributes: Attributes[],
    name: string,
}

export default function AttributeCard({ name, attributes }: OrderedGuestAttributes) {
    return (
        <div className="attr-card">
            <div className="attr-header">
                <div className="attr-row">
                    <span className="attr-check"><DoneIcon htmlColor="green" fontSize="inherit"/></span>
                    <span className="attr-name">{name}</span>
                </div>
            </div>
            <div className="attr-body">
            {Object.values(attributes).map(([key, value]) => (
                <div className="attr-row" key={key}>
                    <span className="attr-key">{translations[key]||key}:</span>
                    <span className="attr-badge">
                        <span className="attr-badge-icon">
                            <VpnKeyIcon htmlColor="gray" fontSize="inherit"/>
                        </span>
                        <span className="attr-value">{value}</span>
                    </span>
                </div>
            ))}
            </div>
        </div>
    );
}
