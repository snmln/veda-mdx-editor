import { CloudBrowse } from 'sanjog-browseui-test';
const CloudBrowseEditor = () => {
    const CLOUD_BROWSE_PROPS = {
    cloudWatchUrlBase: "https://api.cors.lol/?url=https://data.ghg.center",
    sourceIMGUrl: "https://api.cors.lol/?url=https://data.ghg.center",
    version: "v3.3.3",
    excluded_prefixes: ["browseui"]
};
    return (
        <div style={{
            border: '1px solid #2ECC71', padding: '10px', margin: '5px',
            backgroundColor: '#E8F8F5', position: 'relative', overflow: 'hidden', minHeight: '550px'
            }}>
            <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', fontSize: '0.9em', color: '#1E8449', textAlign: 'center' }}>
            Cloud Browse Interface Preview
            </p>
        
            {/* <div style={{ height: '550px', position: 'relative' }}> */}
                <CloudBrowse {...CLOUD_BROWSE_PROPS} />
            {/* </div> */}
        </div>
    );
}

export default CloudBrowseEditor;