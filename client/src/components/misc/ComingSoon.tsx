import ComingSoonPicture from "../../images/coming-soon.png";

const ComingSoon = (): JSX.Element => {
    return (
        <div className="mx-auto my-4 text-center max-width-75nbp-sm">
            <p className="h1">En construcción</p>
            <img className="w-50 opacity-75 my-2" src={ComingSoonPicture} alt="En desarrollo" />
            <p className="h5">Esta sección está en proceso de desarrollo, lamentamos las molestias.</p>
        </div>
    );
}

export default ComingSoon;
