import React, { useEffect, useState } from 'react';
import { AttrCard, OrderedGuestAttributes } from './AttrCard';
import LoginNotice from './LoginNotice';
import { NoAttrs } from './NoAttrs';
import { PoweredBy } from './PoweredBy';
import Unauthorized from './Unauthorized';

type GuestAttributes = {
    attributes: {
        [Key in string]: string
    },
    name: string,
}

type SessionAttributes = {
    [Id in string]: GuestAttributes
}

declare global {
    interface Window {
        SERVER_URL: string
    }
};

export const App = () => {
    const serverUrl = window.SERVER_URL;
    const hostToken = window.location.pathname.substr(1);

    const poll = (): Promise<SessionAttributes> => fetch(`${serverUrl}/session_info/${hostToken}`, {
        credentials: 'include',
    }).then(r => {
        if (r.status == 401) {
            r.json().then(j => {
                setLoginUrl(j.detail + '');
            });
            return [];
        } else if (r.status == 403) {
            setUnauthorized(true);
            setLoginUrl('');
            return [];
        } else {
            setUnauthorized(false);
            setLoginUrl('');
            return r.json()
        }
    })

    const [loginUrl, setLoginUrl] = useState('');
    const [unauthorized, setUnauthorized] = useState(false);
    const [attrs, setAttrs] = useState<OrderedGuestAttributes[]>(null);

    const prepareAttrs = (s: SessionAttributes): OrderedGuestAttributes[] =>
        Object.values(s)
            .sort((record1, record2) => record1.name.localeCompare(record2.name))
            .map(r => ({
                name: r.name, attributes: Object.entries(r.attributes)
                    .sort(([a], [b]) => a.localeCompare(b))
            }));

    // Poll backend to check whether attributes have been received for current session
    useEffect(() => {
        poll().then(s => setAttrs(prepareAttrs(s)));
        const interval = setInterval(() => void poll().then(s => setAttrs(prepareAttrs(s))), 5000);
        return () => clearInterval(interval);
    }, [])

    const attrsAvailable = attrs && Object.keys(attrs).length > 0;

    return (<>
        <div className="id-contact">
            <div className="content">
                {
                    loginUrl ? <LoginNotice loginUrl={loginUrl} />
                    : (
                        unauthorized ? <Unauthorized />
                        : (
                            attrsAvailable ? attrs
                            .map((record, i) => (
                                record ? <AttrCard key={i} name={record.name} attributes={record.attributes} /> : <></>
                            )) : <NoAttrs />
                        )
                    )
                }
            </div>
            <PoweredBy />
        </div>
    </>)
}
