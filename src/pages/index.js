import styles from './index.css';
import Link from 'umi/link';

export default function() {
  return (
    <div className={styles.normal}>
      <div className={styles.welcome} />
      <ul className={styles.list}>
        <li>
        <Link to="/pdf">PDF</Link>
        </li>
        <li>
        <Link to="/drag">DRAG</Link>
        </li>
        <li>
        <Link to="/draw">DRAW</Link>
        </li>
        <li>
        <Link to="/paint">PAINT</Link>
        </li>
        <li>
        <Link to="/test?from=index">TEST</Link>
        </li>
      </ul>
    </div>
  );
}
