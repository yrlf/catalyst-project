import React from 'react';
import Molecule3d from 'molecule-3d-for-react';

const Molecule3DViewer = ({ modelData }) => {
    return (
        <div>
            <Molecule3d
                modelData={modelData}
                backgroundColor="#fff"
                backgroundOpacity={1.0}
                atomLabelsShown={true}
                styles={modelData.styles}
            />
        </div>
    );
};

export default Molecule3DViewer;
