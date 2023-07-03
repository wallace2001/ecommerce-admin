'use client';

interface HeadingProps {
    title: string;
    description?: string;
    center?: boolean;
}

const Heading: React.FC<HeadingProps> = ({
    title,
    description,
    center
}) => {
    return ( 
        <div className={center ? 'text-center' : 'text-start'}>
            <div className="text-3xl font-bold tracking-tight">
                {title}
            </div>
            <div className="font-light text-muted-foreground">
                {description}
            </div>
        </div>
     );
}
 
export default Heading;