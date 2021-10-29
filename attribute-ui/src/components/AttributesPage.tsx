import React, { useEffect, useState } from 'react';
import AttributeList from './AttributeList';
import { OrderedGuestAttributes } from './AttrCard';

import translations from '../translations';

// TODO group these
import LoginNotice from './LoginNotice';

enum Status {
  Loading,
  Unauthenticated,
  Unauthorized,
  LoggedIn,
  Error,
}

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
}

export default function AttributesPage() {
    const serverUrl = window.SERVER_URL;
    const hostToken = window.location.pathname.substr(1);

    const [attributes, setAttributes] = useState<OrderedGuestAttributes[]>([]);
    const [loginUrl, setLoginUrl] = useState('');
    const [status, setStatus] = useState(Status.Loading)

    // include session cookies when polling backend for attributes
    const fetchAttributes = (): void => fetch(`${serverUrl}/session_info/${hostToken}`, {
        credentials: 'include',
    }).then(r => {
        if (r.status == 401) {
            setStatus(Status.Unauthenticated);
            r.json().then(j => {
                setLoginUrl(j.detail + '');
            });
        } else if (r.status == 403) {
            setStatus(Status.Unauthorized);
        } else if (r.status == 200) {
            setStatus(Status.LoggedIn);
            return [{attributes: {'email': 'test@example.nl', 'fullname': 'blaat'}, name: 'test123'}, {attributes: {'email': 'test123@example.nl'}, name: 'test'}];
            // return r.json()
        } else if (r.status > 400) {
            setStatus(Status.Error);
        }

        return [];
    }).then(a => {
        setAttributes(prepareAttributes(a));
    })


    // sort attributes by name before storing them
    const prepareAttributes = (s: SessionAttributes): OrderedGuestAttributes[] =>
        Object.values(s)
            .sort((record1, record2) => record1.name.localeCompare(record2.name))
            .map(r => ({
                name: r.name, attributes: Object.entries(r.attributes)
                    .sort(([a], [b]) => a.localeCompare(b))
            }));

    // poll backend to check whether attributes have been received for current session
    useEffect(() => {
        fetchAttributes();
        const interval = setInterval(fetchAttributes, 5000);
        return () => clearInterval(interval);
    }, [])

    if (status == Status.Unauthenticated) {
        return (
            <div className="notice">
                <p>
                    {translations.login_notice}
                </p>
                <a className="notice-button" target="_blank" rel="noreferrer noopener" href={loginUrl}>{translations.login}</a>
            </div>
        );
    }

    if (status == Status.Unauthorized) {
        return <p className="notice">{translations.unauthorized_notice}</p>
    }

    if (status == Status.LoggedIn) {
        return <AttributeList attributes={attributes} />
    }

    if (status == Status.Error) {
        return (
            <div className="notice">
                <p>
                    {translations.error_notice}
                </p>
                <button className="notice-button" target="_blank" rel="noreferrer noopener" onClick={() => { setStatus(Status.Loading); fetchAttributes()}} >{translations.again}</button>
            </div>
        );
    }

    return <p className="notice">{translations.loading_notice}</p>
}
