import React from 'react';
import AttributeCard, { OrderedGuestAttributes } from './AttributeCard';
import translations from '../translations';

export default function AttributeList({ attributes }: OrderedGuestAttributes[]) {
    console.log(attributes)
    if (Object.keys(attributes).length > 0) {
        return (
            <>
            {
                attributes.map((record, i) =>
                    <AttributeCard key={i} name={record.name} attributes={record.attributes} />)
            }
            </>
        )
    }

    return <p className="notice">{translations.no_attributes_notice}</p>
}
