import Link from 'next/link'

export default ({ currentUser }) => {
    const links = [
        !currentUser && { label: "Sign up", href: "/auth/sign-up" },
        !currentUser && { label: "Sign in", href: "/auth/sign-in" },
        currentUser && { label: "Sell tickets", href: "/tickets/new" },
        currentUser && { label: "My orders", href: "/orders" },
        currentUser && { label: "Sign out", href: "/auth/sign-out" }
    ]
        .filter(linkConfig => linkConfig)
        .map(({ label, href }) => (
            <li key={href}>
                <Link href={href}>
                    <a className="nav-link">{label}</a>
                </Link>
            </li>
        ))

    return (
        <nav className="navbar navbar-light bg-light">
            <Link href="/">
                <a className="navbar-brand">GitTix</a>
            </Link>

            <div className="d-flex justify-content-end">
                <ul className="nav d-flex align-items-center">
                    {links}
                </ul>
            </div>
        </nav>
    )
}